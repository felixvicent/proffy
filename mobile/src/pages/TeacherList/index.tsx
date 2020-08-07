import React, { useState } from 'react';
import { Text, View, ScrollView, TextInput } from 'react-native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';

import api from '../../services/apí';

import styles from './styles';

function TeacherList() {
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const [subject, setSubject] = useState('');
  const [week_day, setWeekDay] = useState('');
  const [time, setTime] = useState('');

  const [teachers, setTeachers] = useState([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  function loadFavorites(){
    AsyncStorage.getItem('favorites').then(response => {
      if(response){
        const favoritedTeachers = JSON.parse(response);
        const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
          return teacher.id;
        });

        setFavorites(favoritedTeachersIds);
      }
    });
  }

  useFocusEffect(() => {
    loadFavorites();
  })
  
  function handleToggleFiltersVisible(){
    setIsFilterVisible(!isFilterVisible);
  }

  async function handleFiltersSubmit(){
    loadFavorites();

    const response = await api.get('classes', {
      params: {
        subject,
        week_day,
        time,
      }
    });

    setTeachers(response.data);
    setIsFilterVisible(false);
  }

  return(
    <View style={ styles.container } >
      <PageHeader
        title='Proffys disponíveis'
        headerRight={(
          <BorderlessButton onPress={ handleToggleFiltersVisible } >
            <Feather name='filter' size={ 20 } color='#fff' />
          </BorderlessButton>
        )}
      >
        { isFilterVisible && (
          <View style={ styles.searchForm }>
            <Text style={ styles.label }>Matéria</Text>
            <TextInput
              placeholderTextColor='#c1bccc'
              style={ styles.input }
              placeholder='Qual a matéria?'
              value={ subject }
              onChangeText={ subject => setSubject(subject) }
            />

            <View style={ styles.inputGroup }>
              <View style={ styles.inputBlock }>
                <Text style={ styles.label }>Dia da semana</Text>
                <TextInput
                  placeholderTextColor='#c1bccc'
                  style={ styles.input }
                  placeholder='Qual o dia?'
                  value={ week_day }
                  onChangeText={ week_day => setWeekDay(week_day) }
                />
              </View>

              <View style={ styles.inputBlock }>
                <Text style={ styles.label }>Horário</Text>
                <TextInput
                  placeholderTextColor='#c1bccc'
                  style={ styles.input }
                  placeholder='Qual horário?'
                  value={ time }
                  onChangeText={ time => setTime(time) }
                />
              </View>
            </View>

            <RectButton onPress={ handleFiltersSubmit } style={ styles.submitButton } >
              <Text style={ styles.submitButtonText }>Filtrar</Text>
            </RectButton>
          </View>
        ) }
      </PageHeader>
      
      <ScrollView
        style={ styles.teacherList }
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
      >
        { teachers.map((teacher: Teacher) => (
          <TeacherItem
            key={ teacher.id }
            teacher={ teacher }
            favorited={ favorites.includes(teacher.id) }
          />
        ) ) }
      </ScrollView>
    </View>
  );
}

export default TeacherList;