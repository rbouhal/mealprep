import React from "react";
import "./Body.css";
import Card from "./Card";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { generatePlan } from "./mealPlanGenerator";

function Body() {
  const handleClick = (e) => {
    const button = e.currentTarget;
  
    if (!button.classList.contains("loading")) {
      button.classList.add("loading");
      setTimeout(() => button.classList.remove("loading"), 3700);
  
      // Generate Meal Plan and Grocery List
      const { weeklyPlan, snacks, drinks, desserts, ingredients } = generatePlan();
  
      // Days of the week mapping
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
      // Create PDF
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter",
      });
  
      // Add header image on page 1
      doc.addImage("Grocery.png", "PNG", 0.25, 0.08, 4.37, 1.12);
  
      // Weekly Meal Plan Table
      const mealPlanRows = weeklyPlan.map((day, index) => [
        daysOfWeek[index], // Map day number to day of the week
        day.breakfast[0],
        day.lunch[0],
        day.dinner[0],
      ]);

      doc.setLineWidth(0.01); // Set a thinner line width for the tables
  
      autoTable(doc, {
        head: [["Day", "Breakfast", "Lunch", "Dinner"]],
        body: mealPlanRows,
        startY: 1.5, // Below the image
        theme: "grid",
      });
  
      // Snacks, Drinks, Desserts
      const otherRows = [
        ["Snacks", snacks.join(", ")],
        ["Drinks", drinks.join(", ")],
        ["Desserts", desserts.join(", ")],
      ];
  
      autoTable(doc, {
        head: [["Category", "Items"]],
        body: otherRows,
        startY: doc.previousAutoTable.finalY + 0.5, // After meal plan
        theme: "grid",
      });
  
      // Start ingredients on a new page
      doc.addPage();
  
      // Add header image on page 2
      doc.addImage("Grocery.png", "PNG", 0.25, 0.08, 4.37, 1.12);
  
      // Ingredients List in Multi-Column Layout
      const pageWidth = doc.internal.pageSize.width;
      const margin = 0.5; // Left margin
      const columnWidth = (pageWidth - 2 * margin) / 3; // Divide into 3 columns
      const rowHeight = 0.2; // Height of each row
      let x = margin;
      let y = 1.5; // Start below the header image
  
      doc.setFontSize(10);
      doc.setLineWidth(0.15); // Set a thinner line width for the tables
      ingredients.forEach((ingredient) => {
        // Draw the circle
        doc.circle(x - 0.05, y - 0.07, 0.01, "S"); // Small circle to the left of the text
  
        // Add text after the circle
        doc.text(ingredient, x + 0.15, y);
  
        // Move to the next row
        y += rowHeight;
  
        // Check if we need to move to the next column
        if (y + rowHeight > doc.internal.pageSize.height - margin) {
          y = 1.5; // Reset Y to start of content on the same page
          x += columnWidth; // Move to the next column
        }
  
        // Check if we exceed the page width (move to next page)
        if (x + columnWidth > pageWidth) {
          doc.addPage();
          x = margin;
          y = 1.5; // Reset Y for new page
          doc.addImage("Grocery.png", "PNG", 0.25, 0.08, 4.37, 1.12); // Add header image
        }
      });
  
      // Save PDF
      doc.save("MealPlan.pdf");
    }
  
    e.preventDefault();
  };
  
  
  
  


  const cardData = [
    {
      image: "Healthy Food.jpg",
      title: "Healthy Meals",
      description: "Discover our curated list of nutritious meal plans.",
    },
    {
      image: "Ingredients.jpg",
      title: "Quick Ingredients",
      description: "Get your grocery list ready in just a click.",
    },
    {
      image: "Weekly.jpg",
      title: "Weekly Plans",
      description: "Plan your meals for the entire week with ease.",
    },
  ];

  return (
    <main>
      <div className="body-center">
        <h1 className="home-title">
          <span>Healthy Meals. Simply Provided.</span>
        </h1>
        <button className="button" onClick={handleClick}>
          <span1>Get Started</span1>
          <div className="cart">
            <svg viewBox="0 0 36 26">
              <polyline points="1 2.5 6 2.5 10 18.5 25.5 18.5 28.5 7.5 7.5 7.5"></polyline>
              <polyline points="15 13.5 17 15.5 22 10.5"></polyline>
            </svg>
          </div>
        </button>
        <h3>
          Press the button above to randomly generate a scheduled meal plan for the week along with a printable list of
          ingredients.
        </h3>
        <div className="card-container">
          {cardData.map((card, index) => (
            <Card key={index} image={card.image} title={card.title} description={card.description} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default Body;
