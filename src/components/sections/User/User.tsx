import {memo, useState} from 'react';
import {useInitData} from '../../../twa-react';
import {
  User as NextUser,
  Modal as NextModal,
  Text, CSS,
} from '@nextui-org/react';
import {Card} from '../../main/Card';
import {Modal} from '../../main/Modal';
import {DataTable} from '../../DataTable';

type Props = {
  css?: CSS;
}

/**
 * Contains information about user which opened Web App.
 */
export const User = memo<Props>(function User(props) {
  const {css = {}} = props;
  const {user} = useInitData();
  const [open, setOpen] = useState(false);

  if (user === undefined) {
    return (
      <Card css={css}>
        <NextUser
          name={'Anonymous'}
          text={'A'}
          description={'No information about user'}
        />
      </Card>
    );
  }

  const {
    firstName, lastName, id, photoUrl, username, isBot, isPremium, languageCode,
  } = user;
  const lines = [
    {title: 'ID', value: id},
    {title: 'Username', value: username},
    {title: 'First name', value: firstName},
    {title: 'Last name', value: lastName},
    {title: 'Photo URL', value: photoUrl},
    {title: 'Is bot', value: isBot},
    {title: 'Is premium', value: isPremium},
    {title: 'Language code', value: languageCode},
  ];

  return (
    <>
      <Card
        isPressable={true}
        onClick={() => setOpen(true)}
        css={css}
      >
        <NextUser
          src={photoUrl}
          name={firstName + ' ' + lastName}
          text={firstName[0]}
          description={username}
          css={{paddingLeft: 0}}
        />
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} header={'Viewport'}>
        <NextModal.Body css={{padding: '8px 16px'}}>
          <Text>
            This component contains information about current user, which
            launched application.
          </Text>
          <DataTable items={lines}/>
        </NextModal.Body>
      </Modal>
    </>
  );
});