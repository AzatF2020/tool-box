import { Text, Flex } from '@radix-ui/themes';

interface IErrorsComponentProps {
  errors: string[];
}

export default function ErrorsComponent({ errors }: IErrorsComponentProps) {
  return (
    <>
      {errors.length > 0 && (
        <Flex direction="column" align="start" gap="1" justify="start">
          {errors.map((error, index) => (
            <Text key={index} size="2" color="red">
              {error}
            </Text>
          ))}
        </Flex>
      )}
    </>
  );
}
