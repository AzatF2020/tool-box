'use client';

import { useEffect, useState } from 'react';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && (
        <IconButton
          onClick={() =>
            getValue!(new HTMLJsonLDGenerator().formatFromJsonToString(value))
          }
        >
          <DoubleArrowRightIcon />
        </IconButton>
      )}
    </>
  );
}
