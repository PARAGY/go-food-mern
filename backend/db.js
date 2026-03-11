

import mongoose from "mongoose";

const mongoURI =
  "mongodb+srv://goFood:Parag7382@cluster0.zboswnp.mongodb.net/goFoodmern?retryWrites=true&w=majority&appName=Cluster0";

const getData = async (callback) => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true });
    console.log("Connected to MongoDB");

    const foodCollection = mongoose.connection.db.collection("food_items");
    const categoryCollection = mongoose.connection.db.collection("foodCategory");

    let data = await foodCollection.find({}).toArray();
    let Catdata = await categoryCollection.find({}).toArray();

    // If no products, insert demo products
    if (!data || data.length === 0) {
      // Demo categories
      Catdata = [
        { _id: "cat1", CategoryName: "Burgers" },
        { _id: "cat2", CategoryName: "Pizza" },
        { _id: "cat3", CategoryName: "Drinks" }
      ];
      await categoryCollection.insertMany(Catdata);

      // Demo products
      data = [
        {
          _id: "item1",
          name: "Signature Truffle Burger",
          CategoryName: "Burgers",
          options: [{ Small: "199", Medium: "299", Large: "399" }],
          img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop",
          description: "A gourmet burger with truffle aioli, caramelized onions, and Swiss cheese.",
          nutrition: { Calories: "450 kcal", Protein: "24g", Carbs: "32g", Fat: "22g" }
        },
        {
          _id: "item2",
          name: "Artisan Margherita Pizza",
          CategoryName: "Pizza",
          options: [{ Regular: "249", Medium: "449", Large: "649" }],
          img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1000&auto=format&fit=crop",
          description: "Classic Margherita with fresh mozzarella, basil, and San Marzano tomatoes.",
          nutrition: { Calories: "310 kcal", Protein: "14g", Carbs: "40g", Fat: "12g" }
        },
        {
          _id: "item3",
          name: "Tropical Mango Smoothie",
          CategoryName: "Drinks",
          options: [{ Small: "129", Medium: "189" }],
          img: "https://images.unsplash.com/photo-1623065422902-30a2d299bf45?q=80&w=1000&auto=format&fit=crop",
          description: "Refreshing blend of ripe mangoes, coconut milk, and a hint of lime.",
          nutrition: { Calories: "180 kcal", Sugar: "32g", VitaminC: "80%" }
        },
        {
          _id: "item4",
          name: "Spicy Paneer Tikka Wrap",
          CategoryName: "Burgers", // Reuse category for demo or add more
          options: [{ Single: "149", Double: "249" }],
          img: "https://images.unsplash.com/photo-1626777553732-4892404df597?q=80&w=1000&auto=format&fit=crop",
          description: "Grilled paneer with spicy mint chutney and veggies in a soft wrap.",
          nutrition: { Calories: "350 kcal", Protein: "16g", Carbs: "38g", Fat: "14g" }
        }
      ];
      await foodCollection.insertMany(data);
    }

    callback(null, data, Catdata);
  } catch (err) {
    console.log("MongoDB Error:", err);
    callback(err, null, null);
  }
};

export default getData;
