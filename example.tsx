'use client';

import InputAdmin from '../../../shared/ui/Input';
import styles from './styles.module.css';
import { SubmitHandler, useForm, Controller, FieldErrors } from 'react-hook-form';
import React from 'react';
import Select from '@shared/ui/Select';
import Button from '@shared/ui/Button';

interface Form {
  login: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  password: string;
  repeatPassword: string;
}

const formFields = [
  { name: 'login', content: 'Логин', type: 'text' },
  { name: 'fullName', content: 'ФИО', type: 'text' },
  { name: 'email', content: 'E-mail', type: 'email' },
  { name: 'phone', content: 'Телефон', type: 'tel' },
  { name: 'password', content: 'Пароль', type: 'password' },
  { name: 'repeatPassword', content: 'Повторите пароль', type: 'password' }
];

const options = [
  { title: 'Редактор', value: 'redaktor' },
  { title: 'Администратор', value: 'admin' }
];

type Props = {
  id: number | undefined;
};

const AddUserForm = (props: Props) => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<Form>({
    defaultValues: {
      login: '',
      fullName: '',
      email: '',
      phone: '',
      position: 'redaktor',
      password: '',
      repeatPassword: ''
    },
    mode: 'onSubmit',
    criteriaMode: 'all'
  });

  const submit: SubmitHandler<Form> = (data) => {};

  return (
    <>
      <span className={styles.title_form}>Добавить пользователя</span>
      <form className={styles.container_form} onSubmit={handleSubmit(submit)}>
        {formFields.slice(0, 4).map((item) => (
          <Controller
            name={item.name as keyof Form}
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <InputAdmin
                  value={value}
                  onChange={onChange}
                  content={item.content}
                  type={item.type}
                  error={error}
                ></InputAdmin>
              </>
            )}
          />
        ))}
        <label className={styles.position_label}>
          Должность
          <Controller
            name="position"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                selected={options.find((o) => o.value === value)}
                options={options}
                onChange={onChange}
              />
            )}
          />
        </label>
        {formFields.slice(4, 6).map((item) => (
          <Controller
            name={item.name as keyof Form}
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <InputAdmin
                  value={value}
                  onChange={onChange}
                  content={item.content}
                  type={item.type}
                  error={error}
                ></InputAdmin>
              </>
            )}
          />
        ))}
        {Object.keys(errors).find(
          (key: string) => errors[key as keyof typeof errors]?.type === 'required'
        ) !== undefined ? (
          <div className={styles.require_fail}>*Поля обязательные для заполнения</div>
        ) : (
          false
        )}
        <Button text={'Сохранить'} color={'var(--color-blue)'} type={'big'} marginTop={'10px'} />
      </form>
    </>
  );
};

export default AddUserForm;