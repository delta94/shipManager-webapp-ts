import React, { useState } from 'react';
import { Select } from 'antd';
import { getOptions } from '@/services/globalService';
import { ICategory } from '@/interfaces/ICategory';
import { useRequest } from 'umi';
import { SelectProps } from 'antd/lib/select';

interface CategorySelectProps extends SelectProps<number> {
  category: ICategory;
  value?: number;
  onSelect?: (value: number) => void;
  showNotChoose?: boolean;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onSelect,
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

  const triggerChange = (changedValue: number) => {
    if (onSelect) {
      onSelect(changedValue);
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
