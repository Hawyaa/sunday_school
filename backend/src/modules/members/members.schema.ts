import { z } from 'zod';

export const RegistrationTypeEnum = z.enum(['SHORT_TERM', 'LONG_TERM']);
export const AgeDivisionEnum = z.enum(['CHILDREN', 'INTERMEDIATE', 'YOUTH']);
export const GenderEnum = z.enum(['MALE', 'FEMALE']);
export const MemberStatusEnum = z.enum(['PENDING', 'APPROVED', 'REJECTED']);

export const createMemberRegistrationSchema = z
  .object({
    registrationType: RegistrationTypeEnum.default('LONG_TERM'),
    division: AgeDivisionEnum,

    // Personal info
    fullName: z.string().min(2, 'የአባሉ ሙሉ ስም ያስፈልጋል (Full name is required)'),
    christianName: z.string().min(2, 'የክርስትና ስም ያስፈልጋል (Christian name is required)'),
    gender: GenderEnum,
    age: z.coerce.number().int().min(1, 'እድሜ ከ 1 በላይ መሆን አለበት').max(120, 'ትክክለኛ እድሜ ያስገቡ'),
    dateOfBirth: z.string().optional().nullable(),
    motherName: z.string().optional().nullable(),
    phoneNumber: z.string().optional().nullable(),
    photoUrl: z.string().optional().nullable(),
    schoolOrOccupation: z.string().optional().nullable(),

    // Confession father info
    confessionFather: z.string().min(2, 'የንስሐ አባት ስም ያስፈልጋል (Confession father name is required)'),
    confessionChurch: z.string().optional().nullable(),
    confessionAddress: z.string().optional().nullable(),

    // Residential address
    address: z.string().min(2, 'መኖርያ አድራሻ ያስፈልጋል (Address is required)'),
    kebele: z.string().optional().nullable(),
    houseNumber: z.string().optional().nullable(),

    // Service & Sunday school info
    admissionDate: z.string().optional().nullable(),
    preferredDepartment: z.string().optional().nullable(),
    talentSkills: z.string().optional().nullable(),

    // Emergency contact
    emergencyContactName: z.string().min(2, 'የቅርብ ተጠሪ ስም ያስፈልጋል (Emergency contact name is required)'),
    emergencyRelationship: z.string().optional().nullable(),
    emergencyContactPhone: z.string().min(5, 'የቅርብ ተጠሪ ስልክ ቁጥር ያስፈልጋል (Contact phone number is required)'),

    // Consent / Declarations
    parentName: z.string().optional().nullable(),
    parentConsent: z.boolean().optional().default(false),
    parentSignatureDate: z.string().optional().nullable(),

    youthCovenantAccepted: z.boolean().optional().default(false),
    youthSignatureDate: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    // If division is CHILDREN or INTERMEDIATE, parent consent/name is strongly recommended
    if ((data.division === 'CHILDREN' || data.division === 'INTERMEDIATE') && !data.parentConsent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['parentConsent'],
        message: 'ለህፃናት እና ለማዕከላውያን የወላጅ/አሳዳጊ ፈቃደኝነት ማረጋገጫ ያስፈልጋል (Parent consent is required for children and intermediate division)',
      });
    }

    // If division is YOUTH, youth covenant acceptance is strongly recommended
    if (data.division === 'YOUTH' && !data.youthCovenantAccepted) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['youthCovenantAccepted'],
        message: 'ለውጣቶች የአባሉ የፈቃደኝነት ቃልኪዳን ማረጋገጫ ያስፈልጋል (Youth covenant agreement is required for youth division)',
      });
    }
  });

export const updateMemberRegistrationSchema = z.object({
  registrationType: RegistrationTypeEnum.optional(),
  division: AgeDivisionEnum.optional(),
  status: MemberStatusEnum.optional(),

  fullName: z.string().min(2).optional(),
  christianName: z.string().min(2).optional(),
  gender: GenderEnum.optional(),
  age: z.coerce.number().int().min(1).max(120).optional(),
  dateOfBirth: z.string().optional().nullable(),
  motherName: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  schoolOrOccupation: z.string().optional().nullable(),

  confessionFather: z.string().min(2).optional(),
  confessionChurch: z.string().optional().nullable(),
  confessionAddress: z.string().optional().nullable(),

  address: z.string().min(2).optional(),
  kebele: z.string().optional().nullable(),
  houseNumber: z.string().optional().nullable(),

  admissionDate: z.string().optional().nullable(),
  preferredDepartment: z.string().optional().nullable(),
  talentSkills: z.string().optional().nullable(),

  emergencyContactName: z.string().min(2).optional(),
  emergencyRelationship: z.string().optional().nullable(),
  emergencyContactPhone: z.string().min(5).optional(),

  parentName: z.string().optional().nullable(),
  parentConsent: z.boolean().optional(),
  parentSignatureDate: z.string().optional().nullable(),

  youthCovenantAccepted: z.boolean().optional(),
  youthSignatureDate: z.string().optional().nullable(),

  approvedByName: z.string().optional().nullable(),
  approverRole: z.string().optional().nullable(),
  approvalDate: z.string().optional().nullable(),
  chairmanName: z.string().optional().nullable(),
  chairmanApprovalDate: z.string().optional().nullable(),
  adminNotes: z.string().optional().nullable(),
});

export const updateMemberStatusSchema = z.object({
  status: MemberStatusEnum,
  approvedByName: z.string().optional(),
  approverRole: z.string().optional(),
  chairmanName: z.string().optional(),
  adminNotes: z.string().optional(),
});
