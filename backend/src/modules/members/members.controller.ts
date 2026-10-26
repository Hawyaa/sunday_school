import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { sendSuccess, sendError } from '../../utils/response';
import { Prisma, MemberStatus, AgeDivision, RegistrationType, Gender } from '@prisma/client';

/**
 * Generates an automated unique registration number:
 * Format: HMD-YYYY-XXXX (e.g. HMD-2026-0001)
 */
async function generateRegistrationNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `HMD-${currentYear}-`;

  const latestRegistration = await prisma.memberRegistration.findFirst({
    where: {
      registrationNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      registrationNumber: true,
    },
  });

  let nextSequence = 1;
  if (latestRegistration && latestRegistration.registrationNumber) {
    const parts = latestRegistration.registrationNumber.split('-');
    const lastNum = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastNum)) {
      nextSequence = lastNum + 1;
    }
  }

  const paddedSequence = String(nextSequence).padStart(4, '0');
  return `${prefix}${paddedSequence}`;
}

/**
 * Public: Register a new member (Short-term or Long-term, Children, Intermediate, Youth)
 */
export async function registerMember(req: Request, res: Response): Promise<void> {
  const data = req.body;

  let registrationNumber = await generateRegistrationNumber();

  // Safeguard against potential collision
  let collisionCheck = await prisma.memberRegistration.findUnique({
    where: { registrationNumber },
  });
  while (collisionCheck) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    registrationNumber = `HMD-${new Date().getFullYear()}-${randomSuffix}`;
    collisionCheck = await prisma.memberRegistration.findUnique({
      where: { registrationNumber },
    });
  }

  const newMember = await prisma.memberRegistration.create({
    data: {
      registrationNumber,
      registrationType: data.registrationType as RegistrationType,
      division: data.division as AgeDivision,
      fullName: data.fullName,
      christianName: data.christianName,
      gender: data.gender as Gender,
      age: data.age,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      motherName: data.motherName || null,
      phoneNumber: data.phoneNumber || null,
      photoUrl: data.photoUrl || null,
      schoolOrOccupation: data.schoolOrOccupation || null,

      confessionFather: data.confessionFather,
      confessionChurch: data.confessionChurch || null,
      confessionAddress: data.confessionAddress || null,

      address: data.address,
      kebele: data.kebele || null,
      houseNumber: data.houseNumber || null,

      admissionDate: data.admissionDate ? new Date(data.admissionDate) : null,
      preferredDepartment: data.preferredDepartment || null,
      talentSkills: data.talentSkills || null,

      emergencyContactName: data.emergencyContactName,
      emergencyRelationship: data.emergencyRelationship || null,
      emergencyContactPhone: data.emergencyContactPhone,

      parentName: data.parentName || null,
      parentConsent: data.parentConsent ?? false,
      parentSignatureDate: data.parentSignatureDate ? new Date(data.parentSignatureDate) : null,

      youthCovenantAccepted: data.youthCovenantAccepted ?? false,
      youthSignatureDate: data.youthSignatureDate ? new Date(data.youthSignatureDate) : null,
    },
  });

  sendSuccess(
    res,
    newMember,
    'የምዝገባ ማመልከቻዎ በተሳካ ሁኔታ ተልኳል (Registration submitted successfully)',
    201
  );
}

/**
 * Admin: List registered members with filtering, search, and pagination
 */
export async function getAdminMembers(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
  const skip = (page - 1) * limit;

  const { division, registrationType, status, gender, search } = req.query;

  const whereClause: Prisma.MemberRegistrationWhereInput = {};

  if (division && typeof division === 'string' && division !== 'All') {
    whereClause.division = division as AgeDivision;
  }

  if (registrationType && typeof registrationType === 'string' && registrationType !== 'All') {
    whereClause.registrationType = registrationType as RegistrationType;
  }

  if (status && typeof status === 'string' && status !== 'All') {
    whereClause.status = status as MemberStatus;
  }

  if (gender && typeof gender === 'string' && gender !== 'All') {
    whereClause.gender = gender as Gender;
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    const term = search.trim();
    whereClause.OR = [
      { fullName: { contains: term } },
      { christianName: { contains: term } },
      { registrationNumber: { contains: term } },
      { phoneNumber: { contains: term } },
      { emergencyContactPhone: { contains: term } },
      { confessionFather: { contains: term } },
    ];
  }

  const [total, members] = await Promise.all([
    prisma.memberRegistration.count({ where: whereClause }),
    prisma.memberRegistration.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  sendSuccess(res, members, 'Members retrieved successfully', 200, {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  });
}

/**
 * Admin: Get member details by ID
 */
export async function getMemberById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const member = await prisma.memberRegistration.findUnique({
    where: { id },
  });

  if (!member) {
    sendError(res, 'Member registration record not found', 404);
    return;
  }

  sendSuccess(res, member, 'Member retrieved successfully');
}

/**
 * Admin: Update member details
 */
export async function updateMember(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const data = req.body;

  const existing = await prisma.memberRegistration.findUnique({ where: { id } });
  if (!existing) {
    sendError(res, 'Member registration record not found', 404);
    return;
  }

  const updated = await prisma.memberRegistration.update({
    where: { id },
    data: {
      ...(data.registrationType && { registrationType: data.registrationType }),
      ...(data.division && { division: data.division }),
      ...(data.status && { status: data.status }),
      ...(data.fullName !== undefined && { fullName: data.fullName }),
      ...(data.christianName !== undefined && { christianName: data.christianName }),
      ...(data.gender && { gender: data.gender }),
      ...(data.age !== undefined && { age: data.age }),
      ...(data.dateOfBirth !== undefined && {
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      }),
      ...(data.motherName !== undefined && { motherName: data.motherName }),
      ...(data.phoneNumber !== undefined && { phoneNumber: data.phoneNumber }),
      ...(data.photoUrl !== undefined && { photoUrl: data.photoUrl }),
      ...(data.schoolOrOccupation !== undefined && { schoolOrOccupation: data.schoolOrOccupation }),
      ...(data.confessionFather !== undefined && { confessionFather: data.confessionFather }),
      ...(data.confessionChurch !== undefined && { confessionChurch: data.confessionChurch }),
      ...(data.confessionAddress !== undefined && { confessionAddress: data.confessionAddress }),
      ...(data.address !== undefined && { address: data.address }),
      ...(data.kebele !== undefined && { kebele: data.kebele }),
      ...(data.houseNumber !== undefined && { houseNumber: data.houseNumber }),
      ...(data.admissionDate !== undefined && {
        admissionDate: data.admissionDate ? new Date(data.admissionDate) : null,
      }),
      ...(data.preferredDepartment !== undefined && { preferredDepartment: data.preferredDepartment }),
      ...(data.talentSkills !== undefined && { talentSkills: data.talentSkills }),
      ...(data.emergencyContactName !== undefined && { emergencyContactName: data.emergencyContactName }),
      ...(data.emergencyRelationship !== undefined && { emergencyRelationship: data.emergencyRelationship }),
      ...(data.emergencyContactPhone !== undefined && { emergencyContactPhone: data.emergencyContactPhone }),
      ...(data.parentName !== undefined && { parentName: data.parentName }),
      ...(data.parentConsent !== undefined && { parentConsent: data.parentConsent }),
      ...(data.parentSignatureDate !== undefined && {
        parentSignatureDate: data.parentSignatureDate ? new Date(data.parentSignatureDate) : null,
      }),
      ...(data.youthCovenantAccepted !== undefined && { youthCovenantAccepted: data.youthCovenantAccepted }),
      ...(data.youthSignatureDate !== undefined && {
        youthSignatureDate: data.youthSignatureDate ? new Date(data.youthSignatureDate) : null,
      }),
      ...(data.approvedByName !== undefined && { approvedByName: data.approvedByName }),
      ...(data.approverRole !== undefined && { approverRole: data.approverRole }),
      ...(data.approvalDate !== undefined && {
        approvalDate: data.approvalDate ? new Date(data.approvalDate) : null,
      }),
      ...(data.chairmanName !== undefined && { chairmanName: data.chairmanName }),
      ...(data.chairmanApprovalDate !== undefined && {
        chairmanApprovalDate: data.chairmanApprovalDate ? new Date(data.chairmanApprovalDate) : null,
      }),
      ...(data.adminNotes !== undefined && { adminNotes: data.adminNotes }),
    },
  });

  sendSuccess(res, updated, 'Member updated successfully');
}

/**
 * Admin: Approve, Reject, or update approval status of a registration
 */
export async function updateMemberStatus(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { status, approvedByName, approverRole, chairmanName, adminNotes } = req.body;

  const existing = await prisma.memberRegistration.findUnique({ where: { id } });
  if (!existing) {
    sendError(res, 'Member registration record not found', 404);
    return;
  }

  const now = new Date();
  const isApproved = status === 'APPROVED';

  const updated = await prisma.memberRegistration.update({
    where: { id },
    data: {
      status,
      approvedByName: approvedByName || (isApproved ? req.admin?.name : existing.approvedByName),
      approverRole: approverRole || (isApproved ? req.admin?.role : existing.approverRole),
      approvalDate: isApproved ? now : existing.approvalDate,
      chairmanName: chairmanName || existing.chairmanName,
      chairmanApprovalDate: chairmanName && isApproved ? now : existing.chairmanApprovalDate,
      adminNotes: adminNotes !== undefined ? adminNotes : existing.adminNotes,
    },
  });

  sendSuccess(
    res,
    updated,
    `Member registration status successfully updated to ${status}`
  );
}

/**
 * Admin: Get registration dashboard analytics and statistics
 */
export async function getMemberStats(_req: Request, res: Response): Promise<void> {
  const [
    total,
    pending,
    approved,
    rejected,
    children,
    intermediate,
    youth,
    shortTerm,
    longTerm,
    male,
    female,
  ] = await Promise.all([
    prisma.memberRegistration.count(),
    prisma.memberRegistration.count({ where: { status: 'PENDING' } }),
    prisma.memberRegistration.count({ where: { status: 'APPROVED' } }),
    prisma.memberRegistration.count({ where: { status: 'REJECTED' } }),
    prisma.memberRegistration.count({ where: { division: 'CHILDREN' } }),
    prisma.memberRegistration.count({ where: { division: 'INTERMEDIATE' } }),
    prisma.memberRegistration.count({ where: { division: 'YOUTH' } }),
    prisma.memberRegistration.count({ where: { registrationType: 'SHORT_TERM' } }),
    prisma.memberRegistration.count({ where: { registrationType: 'LONG_TERM' } }),
    prisma.memberRegistration.count({ where: { gender: 'MALE' } }),
    prisma.memberRegistration.count({ where: { gender: 'FEMALE' } }),
  ]);

  sendSuccess(res, {
    total,
    byStatus: {
      pending,
      approved,
      rejected,
    },
    byDivision: {
      children,
      intermediate,
      youth,
    },
    byType: {
      shortTerm,
      longTerm,
    },
    byGender: {
      male,
      female,
    },
  }, 'Member statistics retrieved');
}

/**
 * Admin: Export member registrations as CSV (supports UTF-8 Geez/Amharic characters for Excel)
 */
export async function exportMembersCsv(req: Request, res: Response): Promise<void> {
  const { division, registrationType, status } = req.query;

  const whereClause: Prisma.MemberRegistrationWhereInput = {};
  if (division && typeof division === 'string' && division !== 'All') {
    whereClause.division = division as AgeDivision;
  }
  if (registrationType && typeof registrationType === 'string' && registrationType !== 'All') {
    whereClause.registrationType = registrationType as RegistrationType;
  }
  if (status && typeof status === 'string' && status !== 'All') {
    whereClause.status = status as MemberStatus;
  }

  const members = await prisma.memberRegistration.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });

  const headers = [
    'Registration Number',
    'Registration Type',
    'Division',
    'Status',
    'Full Name',
    'Christian Name',
    'Gender',
    'Age',
    'Phone Number',
    'Mother Name',
    'Address',
    'Kebele',
    'Confession Father',
    'Service Department',
    'Talent / Skills',
    'Emergency Contact Name',
    'Emergency Contact Phone',
    'Parent Name',
    'Parent Consent',
    'Youth Covenant Accepted',
    'Registration Date',
  ];

  const escapeCsv = (val: any): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = members.map((m) => [
    escapeCsv(m.registrationNumber),
    escapeCsv(m.registrationType),
    escapeCsv(m.division),
    escapeCsv(m.status),
    escapeCsv(m.fullName),
    escapeCsv(m.christianName),
    escapeCsv(m.gender),
    escapeCsv(m.age),
    escapeCsv(m.phoneNumber),
    escapeCsv(m.motherName),
    escapeCsv(m.address),
    escapeCsv(m.kebele),
    escapeCsv(m.confessionFather),
    escapeCsv(m.preferredDepartment),
    escapeCsv(m.talentSkills),
    escapeCsv(m.emergencyContactName),
    escapeCsv(m.emergencyContactPhone),
    escapeCsv(m.parentName),
    escapeCsv(m.parentConsent ? 'Yes' : 'No'),
    escapeCsv(m.youthCovenantAccepted ? 'Yes' : 'No'),
    escapeCsv(m.formFilledDate.toISOString().split('T')[0]),
  ]);

  const csvContent =
    '\uFEFF' + // UTF-8 BOM for Excel Amharic compatibility
    [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=sunday-school-members-${new Date().toISOString().split('T')[0]}.csv`
  );
  res.status(200).send(csvContent);
}

/**
 * Admin: Delete member registration record
 */
export async function deleteMember(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const existing = await prisma.memberRegistration.findUnique({ where: { id } });
  if (!existing) {
    sendError(res, 'Member registration record not found', 404);
    return;
  }

  await prisma.memberRegistration.delete({ where: { id } });

  sendSuccess(res, null, 'Member record deleted successfully');
}
