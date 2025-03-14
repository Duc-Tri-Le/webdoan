import logo from "./logo.png";
import menu1 from "./menu1.png";
import menu2 from "./menu2.png";
import menu3 from "./menu3.png";
import menu4 from "./menu4.png";
import food_1 from "./food_1.png";
import food_2 from "./food_2.png";
import food_3 from "./food_3.png";
import food_4 from "./food_4.png";
import food_5 from "./food_5.png";
import rating_start from "./rating_start.png";
import remove from "./remove.svg";
import add from "./add.svg";
import gg_play from "./gg_play.png";
import app_store from "./app_store.jpg";
import profile from "./profile.jpg"
import order from "./order.png"
import list_items from "./list_items.png"
import upload_image from "./upload_image.png"

const assets = {
  logo,
  rating_start,
  remove,
  add,
  gg_play,
  app_store,
  profile,
  order,
  list_items,
  upload_image,
};

const menu_list = [
  { name: "salad", image: menu1 },
  { name: "coca", image: menu2 },
  { name: "chicken", image: menu3 },
  { name: "duck", image: menu4 },
];

const food_list = [
  {
    _id: "1",
    name: "1",
    image: food_1,
    price: 12,
    description: "food provides",
    category: "salad",
  },
  {
    _id: "2",
    name: "2",
    image: food_2,
    price: 12,
    description: "food provides",
    category: "coca",
  },
  {
    _id: "3",
    name: "3",
    image: food_3,
    price: 12,
    description: "food provides",
    category: "duck",
  },
  {
    _id: "4",
    name: "4",
    image: food_4,
    price: 12,
    description: "food provides",
    category: "chicken",
  },
  {
    _id: "5",
    name: "5",
    image: food_5,
    price: 12,
    description: "food provides",
    category: "salad",
  },
];

export { assets, menu_list, food_list };
