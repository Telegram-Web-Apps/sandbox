import {ChangeEventHandler, memo, useCallback, useState} from 'react';
import {
  useWebAppBackgroundColor, useWebAppClosingConfirmation, useWebAppHeaderColor,
} from '../../../twa-react';
import {
  Modal as NextModal,
  Text,
  CSS, Checkbox, Input, Row, FormElement,
} from '@nextui-org/react';
import {Card} from '../../main/Card';
import {DataTable} from '../../DataTable';
import {Modal} from '../../main/Modal';
import {toRGBExt} from '../../../twa/utils';

type Props = {
  css?: CSS;
}

/**
 * Displays information about back button.
 */
export const WebApp = memo<Props>(function WebApp(props) {
  // Extract all web app information.
  const [bgColor, setBgColor] = useWebAppBackgroundColor();
  const [isClosingConfEnabled, setClosingConf] = useWebAppClosingConfirmation();
  const [headerColor, setHeaderColor] = useWebAppHeaderColor();

  // Create handlers for modal.
  const [open, setOpen] = useState(false);

  // Lines to display.
  const lines = [
    {
      title: 'Is closing confirmation enabled',
      value: (
        <Checkbox isSelected={isClosingConfEnabled} onChange={setClosingConf}/>
      ),
    },
  ];

  const onBgColorChange = useCallback<ChangeEventHandler<FormElement>>(e => {
    const {value} = e.target;
    try {
      setBgColor(toRGBExt(value));
    } catch (e) {
    }
  }, [setBgColor]);

  const onHeaderColorChange = useCallback<ChangeEventHandler<FormElement>>(e => {
    const {value} = e.target;

    if (value === 'bg_color' || value === 'secondary_bg_color') {
      setHeaderColor(value);
    }
  }, [setHeaderColor]);

  return (
    <>
      <Card
        css={props.css}
        isPressable={true}
        onClick={() => setOpen(true)}
      >
        <Text>WebApp</Text>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} header={'WebApp'}>
        <NextModal.Body css={{padding: '8px 16px'}}>
          <Text>
            This component contains information about application web app.
          </Text>
          <DataTable items={lines}/>
          <Row align={'center'}>
            <Text b css={{marginRight: 16}}>Background color</Text>
            <Input bordered value={bgColor} onChange={onBgColorChange}/>
          </Row>
          <Row align={'center'}>
            <Text b css={{marginRight: 16}}>Header color</Text>
            <Input bordered value={headerColor} onChange={onHeaderColorChange}/>
          </Row>
        </NextModal.Body>
      </Modal>
    </>
  );
});