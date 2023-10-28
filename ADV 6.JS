import React, { useState } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, Image, TextInput} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { TabView, SceneMap } from "react-native-tab-view";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  listItem: {
    padding: 10,
    backgroundColor: "#d4d4d4",
    borderRadius: 10,
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#d4d4d4",
    marginBottom: 10,
  },
  button: {
    padding: 10,
    backgroundColor: "#d4d4d4",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  scene: {
    flex: 1,
  },
  deleteButton: {
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
    alignItems: "center",
  },
});

const ListComponent = ({ todos, onDeleteItem }) => {
  return (
    <ScrollView style={styles.scene}>
      {todos.map((todo, index) => (
        <View style={styles.listItem} key={index}>
          {todo.image && (
            <Image source={{ uri: todo.image }} style={styles.image} />
          )}
          <View>
            <Text>{todo.title}</Text>
            <Text>{todo.description}</Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDeleteItem(index)}
          >
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const CreateOrUpdateComponent = ({ onTodoCreate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImage(result.uri);
    }
  };

  const handleCreate = () => {
    if (title && description) {
      const newTodo = {
        title,
        description,
        image: selectedImage,
      };
      onTodoCreate(newTodo);
      setTitle("");
      setDescription("");
      setSelectedImage(null);
    }
  };

  return (
    <View style={styles.scene}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text>Import Image</Text>
      </TouchableOpacity>
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      )}
      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text>Create</Text>
      </TouchableOpacity>
    </View>
  );
};

const initialLayout = { width: 360 };

const App = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "list", title: "List" },
    { key: "createOrUpdate", title: "Create/Update" },
  ]);

  const [todos, setTodos] = useState([]);

  const renderScene = SceneMap({
    list: () => (
      <ListComponent
        todos={todos}
        onDeleteItem={(index) => setTodos(todos.filter((_, i) => i !== index))}
      />
    ),
    createOrUpdate: () => (
      <CreateOrUpdateComponent
        onTodoCreate={(todo) => setTodos([...todos, todo])}
      />
    ),
  });

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
      />
    </View>
  );
};
