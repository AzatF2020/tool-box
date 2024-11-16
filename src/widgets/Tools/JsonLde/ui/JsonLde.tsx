'use client';

import { type ChangeEvent, useEffect, useState } from 'react';
import { Flex, Select, Text, Link } from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { jsonTabs } from '@/shared/lib/utils/constants';
import { CodeBlock } from '@/shared/ui/CodeBlock';
import { ToolLayout } from '@/entities/Tools/ui/ToolLayout';
import { BeatifyJson } from '@/features/Tools/BeatifyJson';
import { IVerifyJson } from '@/features/Tools/VerifyJson/model/model';
import { GenerateHtmlJsonLD } from '@/features/Tools/GenerateHtmlJsonLD';

export default function JsonLde() {
  const [value, setValue] = useState(`
   {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [{
        "@type": "Question",
        "name": "How to find an apprenticeship?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "<p>We provide an official service to search through available apprenticeships. To get started, create an account here, specify the desired region, and your preferences. You will be able to search through all officially registered open apprenticeships.</p>"
        }
      }, {
        "@type": "Question",
        "name": "Whom to contact?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can contact the apprenticeship office through our official phone hotline above, or with the web-form below. We generally respond to written requests within 7-10 days."
        }
      }]
    }
    `);
  const [tab, setTab] = useState<(typeof jsonTabs)[0]>(jsonTabs[0]);
  const [error, setError] = useState<IVerifyJson>({} as IVerifyJson);

  useEffect(() => {
    if (value.length) return;

    setError({} as IVerifyJson);
  }, [value]);

  return (
    <ToolLayout
      title="JSON+LDE Converter to HTML"
      hasCallout
      calloutIcon={<InfoCircledIcon />}
      calloutText={
        <Text>
          To familiarise yourself with structured data markup you can visit{' '}
          <Link
            href="https://json-ld.org/learn.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            JSON-LD documentation
          </Link>
          .
        </Text>
      }
      description="The JSON-LD to HTML Converter Tool is a utility that converts JSON-LD (JavaScript Object Notation for Linked Data) data into HTML 
      (Hypertext Markup Language) format. This tool allows users to transform structured data into a human-readable format, making it easier to visualize 
      and understand the data. Simply paste your JSON-LD data into the input field, and the tool will automatically convert it into HTML format."
    >
      <Flex gap="3" align="start" width="100%">
        <Flex
          gap="5"
          direction="column"
          width="50%"
          align="start"
          justify="start"
        >
          <CodeBlock
            value={value}
            style={{ height: 'calc(100vh - 23.5rem)', overflow: 'auto' }}
            placeholder="Paste your JSON-LD data..."
            hasError={error.hasError}
            errors={error.hasError ? [error.message] : []}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              setValue(event.currentTarget.value)
            }
          />
          <Flex gap="2" align="center">
            <BeatifyJson
              spaces={tab}
              value={value}
              setValue={setValue}
              getStatus={setError}
            />

            <Select.Root
              defaultValue={tab.toString()}
              onValueChange={(value) => setTab(Number(value))}
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Group>
                  <Select.Label>Tabs count:</Select.Label>
                  {jsonTabs.map((tab) => (
                    <Select.Item key={tab} value={tab.toString()}>
                      {tab}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </Flex>
        </Flex>
        <GenerateHtmlJsonLD value={value} />
      </Flex>
    </ToolLayout>
  );
}
