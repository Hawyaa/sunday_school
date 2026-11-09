import {
  attendanceCorrectionSchema,
  createAttendanceSessionSchema,
} from '../../src/modules/attendance/attendance.schema';

const validSession = {
  sessionDate: '2026-11-08',
  division: 'YOUTH',
  groupName: 'Sunday School',
  department: 'Timhirt',
  className: 'Grade 7',
  sessionType: 'Sunday School session',
  records: [
    { memberId: '4bf6c1fd-8fa4-4db4-b134-f762e41445f1', status: 'PRESENT' },
  ],
};

describe('Attendance request validation', () => {
  test('accepts a complete session with unique member marks', () => {
    expect(createAttendanceSessionSchema.safeParse(validSession).success).toBe(true);
  });

  test('rejects duplicate member marks and impossible dates', () => {
    const duplicateMarks = {
      ...validSession,
      records: [...validSession.records, ...validSession.records],
    };
    const invalidDate = { ...validSession, sessionDate: '2026-02-31' };

    expect(createAttendanceSessionSchema.safeParse(duplicateMarks).success).toBe(false);
    expect(createAttendanceSessionSchema.safeParse(invalidDate).success).toBe(false);
  });

  test('requires a meaningful reason for attendance corrections', () => {
    expect(attendanceCorrectionSchema.safeParse({ status: 'ABSENT', reason: 'late arrival' }).success).toBe(true);
    expect(attendanceCorrectionSchema.safeParse({ status: 'ABSENT', reason: 'ok' }).success).toBe(false);
  });
});