const category = {
    categoryDB : [],
    
    initDB()
    {
        this.categoryDB.push({
            title: "Home Appliance",
            imgPath: "house_interior.jpg"
        });

        this.categoryDB.push({
            title: "Women",
            imgPath: "three_women_laughing.jpg"
        });

        this.categoryDB.push({
            title: "Man",
            imgPath: "three_man_photoshoot.jpg"
        });

        this.categoryDB.push({
            title: "Kids",
            imgPath: "kids_photoshoot.jpg"
        })
    },

    getAllCategory()
    {
        return this.categoryDB;
    },

    getFeaturedCategory()
    {
      
    }
}

category.initDB();
module.exports = category;
