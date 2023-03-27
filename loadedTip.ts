export function formatVersion(version: Array<number>): string {
  var resultVersion: string = '';
  version.map(subVer => {
    resultVersion += subVer.toString().padStart(2, '0') + '.';
  });
  return resultVersion.slice(0, -1);
};

export function getTipFormat(string: string, marginWidth: number = 1, _formatStruc?: [string[], string[]]): string {
  var formatStruc = _formatStruc
    || [
      ['╔', '═', '╗'],
      ['╚', '║', '╝'],
    ];

  var marginWidthString = ' '.repeat(marginWidth);
  var marginHeightString = ' \n'.repeat(marginWidth);
  var lineArray = (marginHeightString + string + marginHeightString).split('\n');

  var resultString = '';
  var maxLength = lineArray
    .reduce((acc, line) => Math.max(acc, line.length), 0)
    + marginWidth * 2;

  lineArray.map((line, index) => {
    if (index != 0 && index != lineArray.length - 1) {
      var context = marginWidthString + line + marginWidthString;
      var split = formatStruc[1][1];

      resultString += `${split + context.padEnd(maxLength) + split}\n`;
    } else {
      var isTop = index == 0;
      var left = formatStruc[1 - Number(isTop)][0];
      var right = formatStruc[1 - Number(isTop)][2];
      var width = formatStruc[0][1];

      resultString += `${left + width.repeat(maxLength) + right}\n`;
    };
  });
  return resultString.slice(0, -1);
};