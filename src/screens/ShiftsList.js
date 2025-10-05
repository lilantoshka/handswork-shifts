import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Platform, Alert, RefreshControl, TextInput } from 'react-native';
import { observer, inject } from 'mobx-react';
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const Card = React.memo(({ item, onPress })=>{
  return (
    <TouchableOpacity onPress={onPress} style={{ flexDirection:'row', marginBottom:12, padding:12, borderRadius:12, backgroundColor:'#fff', elevation:2 }}>
      <Image source={{ uri: item.logo }} style={{ width:64, height:64, borderRadius:8 }} />
      <View style={{ marginLeft:12, flex:1 }}>
        <Text style={{ fontWeight:'700', fontSize:15 }}>{item.companyName}</Text>
        <Text style={{ marginTop:4 }}>{item.address}</Text>
        <Text style={{ marginTop:4 }}>{item.dateStartByCity} {item.timeStartByCity}–{item.timeEndByCity}</Text>
        <Text style={{ marginTop:6 }}>{item.priceWorker} ₽ • {item.workTypes}</Text>
      </View>
    </TouchableOpacity>
  );
});

const ShiftsList = inject('shiftsStore')(observer(({ shiftsStore, navigation })=>{
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const doFetch = useCallback((lat=55.751244, lon=37.618423)=>{
    shiftsStore.fetchShifts(lat, lon);
  }, [shiftsStore]);

  useEffect(()=>{
    (async ()=>{
      try{
        const permission = Platform.select({
          ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
          android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        });
        const res = await check(permission);
        if(res !== RESULTS.GRANTED){
          const req = await request(permission);
          if(req !== RESULTS.GRANTED){
            Alert.alert('Разрешение отклонено', 'Приложение требует доступ к геолокации для поиска смен.');
            // fallback to default coords
            doFetch();
            return;
          }
        }
        Geolocation.getCurrentPosition(
          pos => {
            const { latitude, longitude } = pos.coords;
            doFetch(latitude, longitude);
          },
          err => {
            Alert.alert('Ошибка геолокации', err.message);
            doFetch();
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
        );
      }catch(e){
        Alert.alert('Ошибка', e.message);
        doFetch();
      }
    })();
  }, [doFetch]);

  const onRefresh = useCallback(()=>{
    setRefreshing(true);
    // Use last known or default coords; for demo use Moscow center
    shiftsStore.fetchShifts(55.751244, 37.618423).finally(()=>setRefreshing(false));
  }, [shiftsStore]);

  const onPressItem = useCallback((id)=>{
    navigation.navigate('ShiftDetails', { id });
  }, [navigation]);

  if(shiftsStore.loading && shiftsStore.shifts.length===0) return <ActivityIndicator style={{ flex:1 }} />;

  // derived list from store + local search filter
  const list = shiftsStore.filteredShifts.filter(item => {
    if(!search) return true;
    const q = search.toLowerCase();
    return (item.companyName || '').toLowerCase().includes(q) || (item.address||'').toLowerCase().includes(q) || (item.workTypes||'').toLowerCase().includes(q);
  });

  return (
    <View style={{ flex:1, padding:12, backgroundColor:'#f2f3f5' }}>
      <View style={{ flexDirection:'row', marginBottom:12, alignItems:'center' }}>
        <TextInput value={search} onChangeText={setSearch} placeholder="Поиск по компании, адресу, типу" style={{ flex:1, padding:10, backgroundColor:'#fff', borderRadius:8, marginRight:8 }} />
        <TouchableOpacity onPress={()=>{ const next = shiftsStore.filter === 'ALL' ? 'Delivery' : shiftsStore.filter === 'Delivery' ? 'Warehouse' : 'ALL'; shiftsStore.setFilter(next); }} style={{ padding:10, backgroundColor:'#fff', borderRadius:8 }}>
          <Text>{shiftsStore.filter}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={list}
        keyExtractor={item=>String(item.id)}
        renderItem={({item})=> <Card item={item} onPress={()=>onPressItem(item.id)} /> }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={()=>(<View style={{padding:20, alignItems:'center'}}><Text>Смен нет</Text></View>)}
        initialNumToRender={6}
        removeClippedSubviews={true}
      />
    </View>
  );
}));

export default ShiftsList;
