import {memo, SVGProps} from 'react';

type Props = SVGProps<SVGSVGElement>;

export const ChevronRightSvg = memo<Props>(function (props) {
  const {style = {}, ...rest} = props;
  return (
    <svg
      height={20}
      width={20}
      style={{fill: 'currentcolor', ...style}}
      viewBox="0 0 512 512"
      {...rest}
    >
      <polygon
        points="160,128.4 192.3,96 352,256 352,256 352,256 192.3,416 160,383.6 287.3,256 "
      />
    </svg>
  );
});