export default function formatHTML(
  htmlValue: string = '',
  tabSize: number = 2,
): string {
  const tab = Array(tabSize + 1).join(' ');
  let result = '';
  let indent = '';

  htmlValue.split(/>\s*</).forEach((element) => {
    if (element.match(/^\/\w/)) {
      indent = indent.substring(tab.length);
    }

    result += `${indent}<${element}>\r\n`;

    if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith('input')) {
      indent += tab;
    }
  });

  return result.substring(1, result.length - 3);
}
