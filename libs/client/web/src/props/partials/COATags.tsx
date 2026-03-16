import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { debounce } from 'lodash';
import { toast } from 'sonner';

import { request } from '@your-props/client/utils';

import { customSelectStyles } from './utils';

export const COATagInput = ({
  coaTags,
  setCOATags,
}: {
  coaTags: string[];
  setCOATags: Dispatch<SetStateAction<string[]>>;
}) => {
  const [inputValue, setInputValue] = useState('');

  const getTagsList = async (inputValue: string) => {
    try {
      const { data } = await request.post(`/search-coa`, {
        search: inputValue,
      });
      return data.data.map((t: { title: string }) => ({
        label: t.title,
        value: t.title.trim(),
      }));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error fetching COA tags');
      return [];
    }
  };

  const debouncedFetchTags = useCallback(
    debounce((inputValue: string, callback: (options: any[]) => void) => {
      getTagsList(inputValue).then(callback);
    }, 300),
    []
  );

  const handleAddTagFromNoOptions = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !coaTags.includes(trimmedValue)) {
      setCOATags((prev) => [...prev, trimmedValue]);
      setInputValue('');
    }
  };

  return (
    <AsyncSelect
      isMulti
      cacheOptions
      defaultOptions
      styles={customSelectStyles}
      placeholder="Select a value"
      classNamePrefix={'custom-select'}
      value={coaTags?.map((tag) => ({ label: tag, value: tag }))}
      inputValue={inputValue}
      onInputChange={(value, { action }) => {
        if (action !== 'input-blur' && action !== 'menu-close') {
          setInputValue(value);
        }
      }}
      loadOptions={(inputValue) =>
        new Promise((resolve) => debouncedFetchTags(inputValue, resolve))
      }
      onChange={(selectedOptions) => {
        const selectedTags = selectedOptions.map((option) => option.value);
        setCOATags(selectedTags);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleAddTagFromNoOptions();
        }
      }}
      noOptionsMessage={({ inputValue }) =>
        inputValue ? (
          <div
            onClick={handleAddTagFromNoOptions}
            style={{ cursor: 'pointer', color: '#EF6A3B' }}
          >
            Press Enter or click here to add "{inputValue}"
          </div>
        ) : (
          'Start typing to search or add a new value'
        )
      }
      theme={(theme) => ({
        ...theme,
        borderRadius: 0,
        colors: {
          ...theme.colors,
          primary50: '#EF6A3B95',
          primary25: '#EF6A3B95',
          primary: '#EF6A3B',
        },
      })}
    />
  );
};
