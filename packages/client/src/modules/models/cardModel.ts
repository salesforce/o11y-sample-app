import { LogMeta, Schema } from 'o11y/dist/modules/o11y/client/interfaces';
import { SchematizedData } from 'o11y/dist/modules/o11y/shared/shared/TypeDefinitions';

export interface CardModel extends LogMeta {
    msg?: SchematizedData;
    //    payload?: SchematizedData;
    //    schema?: Schema;
}
