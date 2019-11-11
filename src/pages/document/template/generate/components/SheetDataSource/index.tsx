import * as React from 'react';
import { FormComponentProps } from 'antd/es/form';
import { DocumentGenerateStep } from '@/pages/document/template/generate';

interface SheetDataSourceProps extends FormComponentProps {
  ship: Partial<IShip>;
  switchToStep(index: DocumentGenerateStep, ship: Partial<IShip>): void;
}

const fieldLabels = {
  name: '船舶名',
};

class SheetDataSource extends React.Component<SheetDataSourceProps> {
  handleNext = () => {
    const {
      form: { validateFieldsAndScroll },
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        // this.props.switchToStep(1, {})
      }
      this.props.switchToStep(DocumentGenerateStep.Extra, values);
    });
  };

  render() {
    return <div>SheetDataSource</div>;
  }
}

export default SheetDataSource;
