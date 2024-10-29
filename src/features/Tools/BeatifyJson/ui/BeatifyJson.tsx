import { Button } from '@radix-ui/themes';
import {
  model,
  type IVerifyJson,
} from '@/features/Tools/VerifyJson/model/model';

interface IBeatifyJsonProps {
  label?: string;
  value?: string;
  spaces?: number;
  setValue?: (value: string) => void;
  getStatus?: (value: IVerifyJson) => void;
}

export default function BeatifyJson({
  label = 'Beatify Json',
  value = '',
  spaces = 2,
  setValue = () => {},
  getStatus = () => {},
}: IBeatifyJsonProps) {
  const beatifyJson = (jsonValue: string, jsonSpaces: number) => {
    return JSON.stringify(JSON.parse(jsonValue), null, jsonSpaces);
  };

  const getStatusBeatifyJson = (jsonValue: string, jsonSpaces: number) => {
    const validation = model.verifyJson(jsonValue);

    if (validation.hasError) {
      getStatus(model.verifyJson(jsonValue));
      return;
    }

    const result = beatifyJson(jsonValue, jsonSpaces) as string;

    getStatus(model.verifyJson(jsonValue));
    setValue(result);
  };

  return (
    <Button
      type="button"
      disabled={!value.length}
      onClick={() => getStatusBeatifyJson(value, spaces)}
    >
      {label}
    </Button>
  );
}
