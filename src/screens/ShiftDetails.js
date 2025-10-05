import React from 'react';
import { View, Text, Image, Button, ScrollView, Alert } from 'react-native';
import { inject, observer } from 'mobx-react';

const ShiftDetails = inject('shiftsStore')(observer(({ route, shiftsStore })=>{
  const { id } = route.params || {};
  const item = shiftsStore.shifts.find(s => String(s.id) === String(id));
  if(!item) return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}><Text>Данные недоступны</Text></View>
  );

  return (
    <ScrollView style={{ flex:1, padding:16, backgroundColor:'#fff' }}>
      <Image source={{ uri: item.logo }} style={{ width:120, height:120, borderRadius:12 }} />
      <Text style={{ fontSize:20, fontWeight:'700', marginTop:12 }}>{item.companyName}</Text>
      <Text style={{ marginTop:6 }}>{item.address}</Text>
      <Text style={{ marginTop:10 }}>Когда: {item.dateStartByCity} {item.timeStartByCity}–{item.timeEndByCity}</Text>
      <Text>Оплата: {item.priceWorker} ₽</Text>
      <Text>Нужны: {item.planWorkers}, сейчас: {item.currentWorkers}</Text>
      <Text>Тип: {item.workTypes}</Text>
      <Text>Отзывы: {item.customerFeedbacksCount} • Рейтинг: {item.customerRating}</Text>
      <View style={{ marginTop:16 }}>
        <Button title="Записаться" onPress={()=>Alert.alert('Заявка отправлена', 'Это демонстрационная реализация')} />
      </View>
    </ScrollView>
  );
}));

export default ShiftDetails;
