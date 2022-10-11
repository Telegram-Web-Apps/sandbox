import {memo, useState} from 'react';
import {useThemeParams} from '../../../twa-react';
import {Card} from '../../main/Card';
import {
  CSS,
  Modal as NextModal,
  Text,
} from '@nextui-org/react';
import {Modal} from '../../main/Modal';
import {DataTable} from '../../DataTable';

type Props = {
  css?: CSS;
}

/**
 * Displays ThemeParams information.
 */
export const ThemeParams = memo<Props>(function ThemeParams(props) {
  // Extract required information.
  const {
    buttonColor, buttonTextColor, hintColor, textColor, linkColor,
    secondaryBackgroundColor, backgroundColor, colorScheme,
  } = useThemeParams();

  // Create handlers for modal.
  const [open, setOpen] = useState(false);

  // Lines to display.
  const lines = [
    {title: 'Color scheme', value: colorScheme},
    {title: 'Background color', value: backgroundColor},
    {title: 'Button color', value: buttonColor},
    {title: 'Button text color', value: buttonTextColor},
    {title: 'Hint color', value: hintColor},
    {title: 'Link color', value: linkColor},
    {title: 'Secondary background color', value: secondaryBackgroundColor},
    {title: 'Text color', value: textColor},
  ];

  return (
    <>
      <Card
        css={props.css}
        isPressable={true}
        onClick={() => setOpen(true)}
      >
        <Text>ThemeParams</Text>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} header={'ThemeParams'}>
        <NextModal.Body css={{padding: '8px 16px'}}>
          <Text>
            This component contains information about current application
            theme parameters. It is rather useful to consider these colors
            to make your application more native.
          </Text>
          <DataTable items={lines}/>
        </NextModal.Body>
      </Modal>
    </>
  );
});