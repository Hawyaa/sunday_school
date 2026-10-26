import { createMemberRegistrationSchema } from '../../src/modules/members/members.schema';

describe('Member Registration Validation (Zod Schema)', () => {
  test('validates a correct youth registration', () => {
    const validYouth = {
      registrationType: 'LONG_TERM',
      division: 'YOUTH',
      fullName: 'ተስፋዬ ገብረመስቀል',
      christianName: 'ኃይለ ማርያም',
      gender: 'MALE',
      age: 22,
      confessionFather: 'ቀሲስ ዘካርያስ',
      address: 'ወሊሶ ከተማ',
      emergencyContactName: 'ገብረመስቀል አበበ',
      emergencyContactPhone: '0911223344',
      youthCovenantAccepted: true,
    };

    const parsed = createMemberRegistrationSchema.safeParse(validYouth);
    expect(parsed.success).toBe(true);
  });

  test('fails if youth registration does not accept youth spiritual covenant', () => {
    const youthWithoutCovenant = {
      registrationType: 'LONG_TERM',
      division: 'YOUTH',
      fullName: 'ተስፋዬ ገብረመስቀል',
      christianName: 'ኃይለ ማርያም',
      gender: 'MALE',
      age: 22,
      confessionFather: 'ቀሲስ ዘካርያስ',
      address: 'ወሊሶ ከተማ',
      emergencyContactName: 'ገብረመስቀል አበበ',
      emergencyContactPhone: '0911223344',
      youthCovenantAccepted: false,
    };

    const parsed = createMemberRegistrationSchema.safeParse(youthWithoutCovenant);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const parentError = parsed.error.issues.find((i) => i.path.includes('youthCovenantAccepted'));
      expect(parentError).toBeDefined();
    }
  });

  test('validates a correct children registration with parent consent', () => {
    const validChild = {
      registrationType: 'SHORT_TERM',
      division: 'CHILDREN',
      fullName: 'ሳሙኤል ተስፋዬ',
      christianName: 'ገብረ ክርስቶስ',
      gender: 'MALE',
      age: 8,
      confessionFather: 'ቀሲስ ዘካርያስ',
      address: 'ወሊሶ ከተማ',
      emergencyContactName: 'ተስፋዬ ገብረመስቀል',
      emergencyContactPhone: '0911223344',
      parentName: 'ተስፋዬ ገብረመስቀል',
      parentConsent: true,
    };

    const parsed = createMemberRegistrationSchema.safeParse(validChild);
    expect(parsed.success).toBe(true);
  });

  test('fails if children registration does not have parent consent', () => {
    const childWithoutConsent = {
      registrationType: 'SHORT_TERM',
      division: 'CHILDREN',
      fullName: 'ሳሙኤል ተስፋዬ',
      christianName: 'ገብረ ክርስቶስ',
      gender: 'MALE',
      age: 8,
      confessionFather: 'ቀሲስ ዘካርያስ',
      address: 'ወሊሶ ከተማ',
      emergencyContactName: 'ተስፋዬ ገብረመስቀል',
      emergencyContactPhone: '0911223344',
      parentConsent: false,
    };

    const parsed = createMemberRegistrationSchema.safeParse(childWithoutConsent);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const consentError = parsed.error.issues.find((i) => i.path.includes('parentConsent'));
      expect(consentError).toBeDefined();
    }
  });
});
