import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {RenderItemParams} from 'react-native-draggable-flatlist';
import {Place} from '../../types';

interface RenderPlaceItemProps extends RenderItemParams<Place> {
  onDelete: (placeId: string) => void;
}

const RenderPlaceItem = ({item, drag, isActive, onDelete}: RenderPlaceItemProps) => {
  return (
    <View style={[styles.placeContainer, isActive && {backgroundColor: '#f0f0f0'}]}>
      <View>
        <Text style={styles.placeText}>{item.name || ''}</Text>
        <Text style={styles.addressText}>{item.address || ''}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity onPressIn={drag} style={styles.dragHandle}>
          <Image source={require('../../assets/imgs/menu.png')} style={styles.menuIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onDelete(item.id)}>
          <Text style={styles.deleteText}>삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  placeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  placeText: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Pretendard-Bold',
  },
  addressText: {
    fontSize: 14,
    color: '#999999',
    fontFamily: 'Pretendard-Regular',
  },
  menuIcon: {
    width: 20,
    height: 20,
  },
  dragHandle: {
    padding: 5,
  },
  deleteText: {
    color: '#ff4d4f',
    fontWeight: 'medium',
    fontSize: 10,
  },
  actionsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RenderPlaceItem;
