export const reactSelectStyles = {
  placeholder: (defaultStyles: any) => {
    return {
      ...defaultStyles,
      color: '#EDE8E795',
      fontSize  : '16px',
      fontWeight: '400',
      lineHeight: '18px'
    };
  },
  dropdownIndicator: (base: any, state: any) => ({
    ...base,
    transition: 'all .2s ease',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    color: '#8A8AA0',
  }),
  control: (baseStyles: any, state: any) => ({
    ...baseStyles,
    height:'48px',
    color: '#8A8AA0',
    fontSize: '14px',
    lineHeight: '28px',
    padding: '3px 13px',
    borderRadius: '10px',
    fontFamily: 'inherit',
    cursor: 'pointer',
    borderColor: state.isFocused ? '#EF6A3B' : '#8a8aa04d',
    backgroundColor: 'transparent',
  }),
  option: (base: any) => ({
    ...base,
    fontSize: '14px',
    lineHeight: '28px',
    padding: '3px 15px',
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: '#222222',
  }),
  menuList: (base: any) => ({
    ...base,
    maxHeight: '300px',
    backgroundColor: '#222222',
    border: '2px solid #8a8aa0',
  }),
  singleValue: (base: any) => ({
    ...base,
    color: '#fff',
  }),
  input: (base: any) => ({
    ...base,
    color: '#fff',
    fontSize: '14px',
  }),
};

export const customSelectStyles = {
  placeholder: (defaultStyles: any) => {
    return {
      ...defaultStyles,
      color: '#EDE8E795',
      fontSize  : '16px',
      fontWeight: '400',
      lineHeight: '18px'
    };
  },
  dropdownIndicator: (base: any, state: any) => ({
    ...base,
    transition: 'all .2s ease',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    color: '#8A8AA0',
  }),
  control: (baseStyles: any, state: any) => ({
    ...baseStyles,
    height:'48px',
    color: '#8A8AA0',
    fontSize: '14px',
    lineHeight: '28px',
    padding: '3px 13px',
    borderRadius: '10px',
    fontFamily: 'inherit',
    cursor: 'pointer',
    borderColor: state.isFocused ? '#EF6A3B' : '#8a8aa04d',
    backgroundColor: 'transparent',
    overflowY:'auto',overflowX:'hidden',alignItems:'flex-start', justifyContent:'start',flexWrap:'nowrap'
  }),
  option: (base: any) => ({
    ...base,
    fontSize: '14px',
    lineHeight: '28px',
    padding: '3px 15px',
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: '#222222',
  }),
  menuList: (base: any) => ({
    ...base,
    maxHeight: '300px',
    backgroundColor: '#222222',
    border: '2px solid #8a8aa0',
  }),
  singleValue: (base: any) => ({
    ...base,
    color: '#fff',
  }),
  input: (base: any) => ({
    ...base,
    color: '#fff',
    fontSize: '14px',
  }),
};

export const selectStyles = {
  placeholder: (defaultStyles: any) => {
    return {
      ...defaultStyles,
      color: '#EDE8E795',
      fontSize  : '14px',
      fontWeight: '400',
      lineHeight: '18px'
    };
  },
  dropdownIndicator: (base: any, state: any) => ({
    ...base,
    transition: 'all .2s ease',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    color: '#8A8AA0',
  }),
  control: (baseStyles: any, state: any) => ({
    ...baseStyles,
    color: '#8A8AA0',
    fontSize: '14px',
    lineHeight: '28px',
    padding: '3px 13px',
    borderRadius: '10px',
    fontFamily: 'inherit',
    cursor: 'pointer',
    borderColor: state.isFocused ? '#EF6A3B' : '#8a8aa04d',
    backgroundColor: 'transparent',
  }),
  option: (base: any) => ({
    ...base,
    fontSize: '14px',
    lineHeight: '28px',
    padding: '3px 15px',
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: '#222222',
  }),
  menuList: (base: any) => ({
    ...base,
    maxHeight: '300px',
    backgroundColor: '#222222',
    border: '2px solid #8a8aa0',
  }),
  singleValue: (base: any) => ({
    ...base,
    color: '#fff',
  }),
  input: (base: any) => ({
    ...base,
    color: '#fff',
    fontSize: '14px',
  }),
};
