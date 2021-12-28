import { CardModel } from './cardModel';

export interface LogModel extends CardModel {
    _isActivity?: boolean;
    _isError?: boolean;
    _isInstrumentedEvent?: boolean;
    _isO11ySimple?: boolean;
    _isO11ySample?: boolean;
    _isUnknown?: boolean;
}
