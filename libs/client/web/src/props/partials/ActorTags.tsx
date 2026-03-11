import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { debounce } from 'lodash';
import { toast } from 'sonner';

import { request } from '@your-props/client/utils';

import { customSelectStyles } from './utils';

export const ActorTagInput = ({
  actorTags,
  setActorTags,
}: {
  actorTags: string[];
  setActorTags: Dispatch<SetStateAction<string[]>>;
}) => {
  const [inputValue, setInputValue] = useState('');

  const getTagsList = async (inputValue: string) => {
    try {
      const { data } = await request.get(`/search-tags?q=${inputValue}`);
      return data.tags.map((t: { label: string }) => ({
        label: t.label,
        value: t.label.trim(),
      }));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error fetching tags');
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
    if (trimmedValue && !actorTags.includes(trimmedValue)) {
      setActorTags((prev) => [...prev, trimmedValue]);
      setInputValue('');
    }
  };

  return (
    <AsyncSelect
      isMulti
      cacheOptions
      defaultOptions
      placeholder="Select an actor/actress"
      classNamePrefix={'custom-select'}
      styles={customSelectStyles}
      value={actorTags?.map((tag) => ({ label: tag, value: tag }))}
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
        setActorTags(selectedTags);
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
