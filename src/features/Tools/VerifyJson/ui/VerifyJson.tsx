import { Button } from '@radix-ui/themes';
import {
  model,
  type IVerifyJson,
} from '@/features/Tools/VerifyJson/model/model';

export interface IVerifyJsonProps {
  value?: string;
  label?: string;
  getStatus: (value: IVerifyJson) => void;
}

export default function VerifyJson({
  value = '',
  label = 'Verify Json',
  getStatus = () => {},
}: IVerifyJsonProps) {
  return (
    <Button
      type="button"
      onClick={() => {
        getStatus(model.verifyJson(value));
      }}
      disabled={!value.length}
    >
      {label}
    </Button>
  );
}
