import React, { useRef, useState } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, Animated } from 'react-native';

// Get the screen width
const { width: screenWidth } = Dimensions.get('window');

// Dummy images for the carousel


const CustomCarousel = ({images}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.carouselItem}>
            <Image resizeMethod="contain" source={{ uri: item }} style={styles.image} />
          </View>
        )}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {images.map((_, index) => {
          const inputRange = [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth];

          const dotSize = scrollX.interpolate({
            inputRange,
            outputRange: [8, 10, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 0.01, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[styles.paginationDot, { width: dotSize, height: dotSize, opacity }]}
            />
          );
        })}
      </View>

      {/* Optional Text Display for Active Slide */}
      {/* <Text style={styles.caption}>Image {activeIndex + 1} of {images.length}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // borderRadius:100,
    width:150,
    // marginLeft: 50,
    justifyContent: 'center',
  },
  carouselItem: {
    width: 150,
    height:150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    borderRadius:10,
    height: '100%',
    // resizeMode: 'cover',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  paginationDot: {
    backgroundColor: '#888',
    borderRadius: 4,
    marginHorizontal: 5,
  },
  caption: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
    color: '#333',
  },
});

export default CustomCarousel;