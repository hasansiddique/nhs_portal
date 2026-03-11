import { useEffect, useRef, useState } from 'react';

export const ShowPasswordStrength = ({ form }: any) => {
  const password = useRef({});
  password.current = form.watch('password', '');

  const [passwordValidations, setPasswordValidations] = useState<
    { name: string; isValid: boolean }[]
  >([]);

  const passwordConditions = [
    {
      name: 'Minimum length of 8 characters',
      validate: (passValue: string) => passValue.length >= 8,
    },
    {
      name: 'Contains at least one special character',
      validate: (passValue: string) => /[!@#$%^&*(),.?":{}|<>]/.test(passValue),
    },
    {
      name: 'Contains at least one lowercase letter',
      validate: (passValue: string) => /[a-z]/.test(passValue),
    },
    {
      name: 'Contains at least one uppercase letter',
      validate: (passValue: string) => /[A-Z]/.test(passValue),
    },
  ];

  const checkPasswordValidations = (passValue: any) => {
    const updatedConditions = passwordConditions.map((condition) => ({
      ...condition,
      isValid: condition.validate(passValue),
    }));
    setPasswordValidations(updatedConditions);
  };

  useEffect(() => {
    checkPasswordValidations(password.current);
  }, [password.current]);

  const calculatePasswordStrength = (password: any): number => {
    let score = 0;
    passwordConditions.forEach((condition) => {
      if (condition.validate(password)) {
        score += 1;
      }
    });
    return score;
  };

  const [strength, setStrength] = useState(0);

  useEffect(() => {
    const newStrength = calculatePasswordStrength(password.current);
    setStrength(newStrength);
  }, [password.current]);

  const getStrengthColor = (): string => {
    switch (strength) {
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div>
      <div className="strength-meter mt-2 flex">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`strength-meter-fill grow h-2 mx-1 ${
              index < strength ? getStrengthColor() : 'bg-gray-300'
            }`}
          ></div>
        ))}
      </div>

      {/* Strength Label */}
      <p className="text-[16px] font-bold mt-2">
        Strength:{' '}
        {strength === 0
          ? 'Weak'
          : strength === 1
          ? 'Weak'
          : strength === 2
          ? 'Fair'
          : strength === 3
          ? 'Moderate'
          : 'Very Strong'}
      </p>

      {/* Password Validation Messages */}
      <ul>
        {passwordValidations.map((validation, index) => (
          <li
            key={index}
            style={{
              color: validation.isValid ? '#22c55e' : '#cacaca',
            }}
          >
            <div className="flex items-center gap-2">
              <Icon fill={validation.isValid ? '#22c55e' : '#cacaca'} />
              {validation.name}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Icon = ({ fill }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
  >
    <g id="vuesax/bold/tick-circle">
      <g id="tick-circle">
        <path
          id="Vector"
          d="M7.99992 1.83325C4.32659 1.83325 1.33325 4.82659 1.33325 8.49992C1.33325 12.1733 4.32659 15.1666 7.99992 15.1666C11.6733 15.1666 14.6666 12.1733 14.6666 8.49992C14.6666 4.82659 11.6733 1.83325 7.99992 1.83325ZM11.1866 6.96659L7.40659 10.7466C7.31325 10.8399 7.18659 10.8933 7.05325 10.8933C6.91992 10.8933 6.79325 10.8399 6.69992 10.7466L4.81325 8.85992C4.61992 8.66659 4.61992 8.34659 4.81325 8.15325C5.00659 7.95992 5.32659 7.95992 5.51992 8.15325L7.05325 9.68659L10.4799 6.25992C10.6733 6.06659 10.9933 6.06659 11.1866 6.25992C11.3799 6.45325 11.3799 6.76659 11.1866 6.96659Z"
          fill={fill}
        />
      </g>
    </g>
  </svg>
);
