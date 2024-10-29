import { getErrorMessage, extractStringValue } from '@/shared/lib/helpers';
import { jsonSchema } from '@/shared/lib/schemas';

interface IVerifyJson {
  hasError: boolean;
  message: string;
  line: number;
  column: number;
}

function verifyJson(json: string): IVerifyJson {
  const result = {
    hasError: false,
    message: '',
    line: -1,
    column: -1,
  };

  try {
    jsonSchema.validateSync(JSON.parse(json));
    return result;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    const line = Number(extractStringValue(errorMessage, /line (\d+)/));
    const column = Number(extractStringValue(errorMessage, /column (\d+)/));

    return {
      hasError: true,
      message: `Error at line ${line}, column ${column}`,
      line: Number(line),
      column: Number(line),
    };
  }
}

export type { IVerifyJson };

export const model = {
  verifyJson,
};
