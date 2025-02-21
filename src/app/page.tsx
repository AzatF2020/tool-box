import { Button } from '@radix-ui/themes';
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/json-lde-converter');

  return (
    <div>
      <Button>Hello world</Button>
    </div>
  );
}
