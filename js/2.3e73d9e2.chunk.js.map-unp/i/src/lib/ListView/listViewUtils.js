import BooleanCell from './CellTypes/BooleanCell';
import DateCell from './CellTypes/DateCell';
import EnumCell from './CellTypes/EnumCell';
import MoneyCell from './CellTypes/MoneyCell';
import NumberCell from './CellTypes/NumberCell';
import ObjectCell from './CellTypes/ObjectCell';
import TextCell from './CellTypes/TextCell';

export function createDefaultCellForType(type) {
  switch (type) {
    case 'TEXT':
      return TextCell;
    case 'DATE_TIME':
      return DateCell;
    case 'BOOLEAN':
      return BooleanCell;
    case 'ENUM':
      return EnumCell;
    case 'MONEY':
      return MoneyCell;
    case 'NUMBER':
      return NumberCell;
    case 'REFERENCE':
    case 'COLLECTION':
      return ObjectCell;
    default:
      return TextCell;
  }
}
