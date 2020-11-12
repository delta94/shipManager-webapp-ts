import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { getOptions } from '@/services/globalService';
import { ICategory } from '@/interfaces/ICategory';
import { useRequest } from 'umi';
import { SelectProps } from 'antd/lib/select';
import usePrevious from '@/hooks/usePrevious';
import { FormInstance } from 'antd/lib/form';

interface CategorySelectProps extends SelectProps<number> {
  category: ICategory;
  value?: number;
  onSelect?: (value: number) => void;
  onChange?: (value: number) => void;
  showNotChoose?: boolean;
  form?: FormInstance;
  linkTypeNameField?: string;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  form,
  linkTypeNameField,
  value,
  onSelect,
  onChange,
  category,
  showNotChoose = true,
  ...restProps
}) => {
  const { data } = useRequest(getOptions, {
    manual: false,
    defaultParams: [category],
    cacheKey: `${category}_types`,
  });

  const [selectNumber, setSelectNumber] = useState<number>();

  const previousValue = usePrevious(value);

  useEffect(() => {
    if (previousValue == undefined && value != undefined) {
      setSelectNumber(value);
      triggerChange(value);
    }
  }, [previousValue, value]);

  const triggerChange = (changedValue: number) => {
    if (onSelect) {
      onSelect(changedValue);
    }
    if (onChange) {
      onChange(changedValue);
    }
    if (form && linkTypeNameField) {
      let pair = data?.find((item) => item.id == changedValue);
      if (pair) {
        form.setFieldsValue({
          [linkTypeNameField]: pair.name,
        });
      }
    }
  };

  const onSelectChange = (value: number) => {
    if (Number.isNaN(value)) return;
    setSelectNumber(value);
    triggerChange(value);
  };

  return (
    <Select value={selectNumber} onSelect={onSelectChange} {...restProps}>
      {showNotChoose && (
        <Select.Option key={99} value={-1}>
          不限类型
        </Select.Option>
      )}
      {data?.map((item) => {
        return (
          <Select.Option key={item.id} value={item.id}>
            {item.name}
          </Select.Option>
        );
      })}
    </Select>
  );
};

export default CategorySelect;
