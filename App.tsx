import React from "react";
import {
  FlatList,
  Image,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const { width, height } = Dimensions.get("screen");

const API_KEY = "FHRQZ4nHHDYUplEY5ea6uYbfgVeXRqRLpmfjmrxMqV3271137Uzfx2uj";
const API_URL =
  "https://api.pexels.com/v1/search?query=nature&orientation=portrait&size=small&per_page=20";

const imageSize = 80;
const inGap = 10;

const fetchImagesAPI = async () => {
  const data = await fetch(API_URL, {
    headers: {
      authorization: API_KEY,
    },
  });
  const { photos } = await data.json();
  return photos;
};

export default function App() {
  const [images, setImages] = React.useState(null);
  React.useEffect(() => {
    const fetchImages = async () => {
      const images = await fetchImagesAPI();
      setImages(images);
    };
    fetchImages();
  }, []);

  const topRef: any = React.useRef();
  const thumbRef: any = React.useRef();
  const [activeIndex, setActiveIndex] = React.useState(0);

  const scrollActiveIndex = (index: any) => {
    setActiveIndex(index);
    topRef?.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });
    if (index * (imageSize + inGap) - imageSize / 2 > width / 2) {
      thumbRef?.current?.scrollToOffset({
        offset: index * (imageSize + inGap) - width / 2 + imageSize / 2,
        animated: true,
      });
    } else {
      thumbRef?.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }
  };

  if (!images) {
    return <Text>Loading...</Text>;
  }

  // console.log(images);
  return (
    <View style={styles.root}>
      <FlatList
        ref={topRef}
        data={images}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(ev) => {
          scrollActiveIndex(Math.floor(ev.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({ item }) => {
          return (
            <View style={{ width, height }}>
              <Image
                source={{ uri: item.src.portrait }}
                style={[StyleSheet.absoluteFillObject]}
              />
            </View>
          );
        }}
      />

      <FlatList
        ref={thumbRef}
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.second}
        contentContainerStyle={{ paddingHorizontal: inGap }}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity onPress={() => scrollActiveIndex(index)}>
              <Image
                source={{ uri: item.src.portrait }}
                style={{
                  width: imageSize,
                  height: imageSize,
                  borderRadius: 12,
                  marginRight: inGap,
                  borderWidth: 2,
                  borderColor: activeIndex === index ? "#fff" : "black",
                }}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  second: { position: "absolute", bottom: imageSize },
});
