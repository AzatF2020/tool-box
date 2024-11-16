'use client';

import { IconButton } from '@radix-ui/themes';
import { DoubleArrowRightIcon } from '@radix-ui/react-icons';
import HTMLJsonLDGenerator from '@/features/Tools/GenerateHtmlJsonLD/model/model';

interface IGenerateHtmlJsonLDProps {
  value: string;
  getValue?: (value: string) => void;
}

export default function GenerateHtmlJsonLD({
  value,
  getValue,
}: IGenerateHtmlJsonLDProps) {
  return (
    <IconButton
      onClick={() =>
        getValue(HTMLJsonLDGenerator.formatFromJsonToString(value))
      }
    >
      <DoubleArrowRightIcon />
    </IconButton>
  );
}
