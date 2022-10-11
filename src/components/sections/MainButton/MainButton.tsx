import {
  ChangeEvent,
  ChangeEventHandler,
  memo,
  useCallback,
  useState,
} from 'react';
import {
  useMainButtonActive,
  useMainButtonColor,
  useMainButtonProgressVisible,
  useMainButtonText, useMainButtonTextColor,
  useMainButtonVisible,
} from '../../../twa-react';
import {
  Modal as NextModal,
  Text,
  Button,
  CSS, Checkbox, Input, useInput, Row, FormElement,
} from '@nextui-org/react';
import {Card} from '../../main/Card';
import {DataTable} from '../../DataTable';
import {Modal} from '../../main/Modal';
import {MainButton as SDKMainButton} from '../../../twa';
import {toRGBExt} from '../../../twa/utils';

type Props = {
  css?: CSS;
}

/**
 * Displays information about main button.
 */
export const MainButton = memo<Props>(function MainButton(props) {

  // Extract all main button information.
  const [isActive, setActive] = useMainButtonActive();
  const [color, setButtonColor] = useMainButtonColor();
  const [isProgressVisible, setProgressVisible] = useMainButtonProgressVisible();
  const [text, setText] = useMainButtonText();
  const [textColor, setTextColor] = useMainButtonTextColor();
  const [isVisible, setVisible] = useMainButtonVisible();

  // Create handlers for modal.
  const [open, setOpen] = useState(false);
  const onTextChange = useCallback<ChangeEventHandler<FormElement>>(e => {
    const {value} = e.target;

    if (value.length > 0) {
      setText(value);
    }
  }, []);

  const onButtonColorChange = useCallback<ChangeEventHandler<FormElement>>(e => {
    const {value} = e.target;
    try {
      const rgb = toRGBExt(value);
      setButtonColor(rgb);
    } catch (e) {
    }
  }, []);

  const onTextColorChange = useCallback<ChangeEventHandler<FormElement>>(e => {
    const {value} = e.target;
    try {
      const rgb = toRGBExt(value);
      setTextColor(rgb);
    } catch (e) {
    }
  }, []);

  // Lines to display.
  const lines = [
    {
      title: 'Is active',
      value: <Checkbox isSelected={isActive} onChange={setActive}/>,
    },
    {
      title: 'Is visible',
      value: <Checkbox isSelected={isVisible} onChange={setVisible}/>,
    },
    {
      title: 'Is progress visible',
      value: (
        <Checkbox isSelected={isProgressVisible} onChange={setProgressVisible}/>
      ),
    },
  ];

  return (
    <>
      <Card
        css={props.css}
        isPressable={true}
        onClick={() => setOpen(true)}
      >
        <Text>MainButton</Text>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} header={'MainButton'}>
        <NextModal.Body css={{padding: '8px 16px'}}>
          <Text>
            This component contains information about application's main button.
          </Text>
          <DataTable items={lines}/>
          <Row align={'center'}>
            <Text b css={{marginRight: 16}}>Text</Text>
            <Input bordered value={text} onChange={onTextChange}/>
          </Row>
          <Row align={'center'}>
            <Text b css={{marginRight: 16}}>Button color</Text>
            <Input bordered value={color} onChange={onButtonColorChange}/>
          </Row>
          <Row align={'center'}>
            <Text b css={{marginRight: 16}}>Text color</Text>
            <Input bordered value={textColor} onChange={onTextColorChange}/>
          </Row>
          {/*<Button.Group>*/}
          {/*  <Button*/}
          {/*    color={'primary'}*/}
          {/*    onClick={() => SDKBackButton.show()}*/}
          {/*    disabled={isVisible}*/}
          {/*  >*/}
          {/*    Show*/}
          {/*  </Button>*/}
          {/*  <Button*/}
          {/*    color={'primary'}*/}
          {/*    onClick={() => SDKBackButton.hide()}*/}
          {/*    disabled={!isVisible}*/}
          {/*  >*/}
          {/*    Hide*/}
          {/*  </Button>*/}
          {/*</Button.Group>*/}
        </NextModal.Body>
      </Modal>
    </>
  );
});