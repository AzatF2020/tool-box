import type { ReactNode } from 'react';
import { Heading, Text, Callout } from '@radix-ui/themes';

interface IToolLayoutProps {
  title: string | ReactNode;
  description?: string | ReactNode;
  hasCallout?: boolean;
  calloutText?: string | ReactNode;
  calloutIcon?: ReactNode;
  children: ReactNode;
}

export default function ToolLayout({
  title = '',
  description = '',
  hasCallout = false,
  calloutText = '',
  calloutIcon,
  children,
}: IToolLayoutProps) {
  return (
    <div>
      {hasCallout && (
        <Callout.Root mb="5">
          <Callout.Icon>{calloutIcon}</Callout.Icon>
          <Callout.Text>{calloutText}</Callout.Text>
        </Callout.Root>
      )}
      <Heading as="h1" mb="5">
        {title}
      </Heading>
      {description && (
        <Text as="p" mb="5" size="2">
          {description}
        </Text>
      )}
      {children}
    </div>
  );
}
