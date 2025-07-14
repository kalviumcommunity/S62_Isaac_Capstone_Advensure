import React, { useState, useRef, use } from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { set } from "mongoose";
function BudgetPage() {
  const location = useLocation();
  const budgetFromPlanTrip=location.state?.budget || 0; // Get budget from location state if available
  const fuelCost = location.state?.fuelCost || 0; // Get fuel cost from location state if available
  const [budget, setBudget] = useState(budgetFromPlanTrip);
  const [fuel, setFuel] = useState(fuelCost);
  const [accommodation, setAccommodation] = useState(0);
  const [food, setFood] = useState(0);
  const [activities, setActivities] = useState(0);
  const [people, setPeople] = useState([]);
  const [name, setName] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const[overBudget, setOverBudget] = useState(false); // State to track if budget is exceeded
  const [editingPersonIndex, setEditingPersonIndex] = useState(null); // New state for editing
  const summaryRef = useRef();

  const total = Number(fuel) + Number(accommodation) + Number(food) + Number(activities);
  useEffect(() => {
    if (total > budget) {
      setOverBudget(true); // Set over budget state
    }
    if (total<=budget){
      setOverBudget(false); // Reset over budget state
    }
  }, [total, budget]);

  const handleAddOrUpdatePerson = () => {

    if (name && amountPaid !== "") {
      if (editingPersonIndex !== null) {
        // Update existing person
        const updatedPeople = [...people];
        updatedPeople[editingPersonIndex] = { name, amountPaid: Number(amountPaid) };
        setPeople(updatedPeople);
        setEditingPersonIndex(null); // Reset editing state
      } else {
        // Add new person
        setPeople([...people, { name, amountPaid: Number(amountPaid) }]);
      }
      setName("");
      setAmountPaid("");
    }
  };

  const handleEditPerson = (index) => {
    setEditingPersonIndex(index);
    setName(people[index].name);
    setAmountPaid(people[index].amountPaid);
  };

  const handleDeletePerson = (index) => {
    const updatedPeople = people.filter((_, i) => i !== index);
    setPeople(updatedPeople);
    if (editingPersonIndex === index) {
      setEditingPersonIndex(null); // Clear editing if deleted person was being edited
      setName("");
      setAmountPaid("");
    }
  };

  const perPersonShare = people.length > 0 ? total / people.length : 0;

  const balances = people.map((person) => ({
    name: person.name,
    paid: person.amountPaid,
    owes: perPersonShare - person.amountPaid,
  }));

  // Refined "Who Pays Whom" logic for clear transactions
  const getTransactions = () => {
    const payers = balances.filter(b => b.owes < 0).map(b => ({ ...b, owes: Math.abs(b.owes) })); // Convert to positive for "gets back"
    const owers = balances.filter(b => b.owes > 0).map(b => ({ ...b }));

    const result = [];

    // Sort payers by amount they need to get back (largest first)
    payers.sort((a, b) => b.owes - a.owes);
    // Sort owers by amount they owe (largest first)
    owers.sort((a, b) => b.owes - a.owes);

    let payerIndex = 0;
    let owerIndex = 0;

    while (payerIndex < payers.length && owerIndex < owers.length) {
      let payer = payers[payerIndex];
      let ower = owers[owerIndex];

      const amountToTransfer = Math.min(payer.owes, ower.owes);

      if (amountToTransfer > 0.01) { // Only record significant transactions
        result.push(`${ower.name} pays ₹${amountToTransfer.toFixed(2)} to ${payer.name}`);
      }

      payer.owes -= amountToTransfer;
      ower.owes -= amountToTransfer;

      if (payer.owes < 0.01) {
        payerIndex++;
      }
      if (ower.owes < 0.01) {
        owerIndex++;
      }
    }
    return result;
  };

  const transactions = getTransactions();

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Summary
    csvContent += "Trip Budget Summary\n";
    csvContent += `Total Expenses:,₹${total}\n`;
    csvContent += `Number of People:,${people.length}\n`;
    csvContent += `Per Person Share:,₹${perPersonShare.toFixed(2)}\n\n`;

    // Balance Sheet
    csvContent += "Balance Sheet\n";
    csvContent += "Name,Amount Paid,Balance\n";
    balances.forEach((person) => {
      csvContent += `${person.name},₹${person.paid},`;
      if (person.owes > 0) {
        csvContent += `Owes ₹${person.owes.toFixed(2)}\n`;
      } else {
        csvContent += `Gets back ₹${Math.abs(person.owes).toFixed(2)}\n`;
      }
    });
    csvContent += "\n";

    // Who Pays Whom - detailed
    if (transactions.length > 0) {
      csvContent += "Who Pays Whom (Settlement Transactions)\n";
      transactions.forEach((line) => {
        csvContent += `${line}\n`;
      });
      csvContent += "\n";
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "trip-budget-summary.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative h-96 bg-cover bg-center bg-gradient-to-r from-blue-600 to-purple-700"
      >
        {/* This div is for the translucent overlay */}
        <div className="absolute inset-0 bg-black opacity-20"></div>

        {/* This div is for the text, and it should be on top and fully opaque */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl text-white font-bold text-center px-4">Manage Your Trip Budget with Ease</h1>
        </div>
      </section>

      {/* Main Budget Planner Content */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 -mt-20 relative z-10"> {/* -mt-20 to pull it up over the hero */}
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Budget Planner</h2>

        <div className="mb-4">
          <label className="block text-gray-700">Total Trip Budget (₹)</label>
          <input
            type="number"
            min={0}
            className="w-full border rounded px-3 py-2 mt-1"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Enter your total budget"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Fuel (₹)</label>
            <input
              min={0}
              type="number"
              className="w-full border rounded px-3 py-2 mt-1"
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">Accommodation (₹)</label>
            <input
              type="number"
              min={0}
              className="w-full border rounded px-3 py-2 mt-1"
              value={accommodation}
              onChange={(e) => setAccommodation(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">Food (₹)</label>
            <input
              type="number"
              min={0}
              className="w-full border rounded px-3 py-2 mt-1"
              value={food}
              onChange={(e) => setFood(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">Activities (₹)</label>
            <input
              type="number"
              min={0}
              className="w-full border rounded px-3 py-2 mt-1"
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {editingPersonIndex !== null ? "Edit Person" : "Add Person"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount Paid (₹)"
              className="w-full border rounded px-3 py-2"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddOrUpdatePerson}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingPersonIndex !== null ? "Update Person" : "Add Person"}
          </button>
          {editingPersonIndex !== null && (
            <button
              onClick={() => {
                setEditingPersonIndex(null);
                setName("");
                setAmountPaid("");
              }}
              className="ml-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {people.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Added People</h3>
            <ul className="divide-y divide-gray-200">
              {people.map((person, index) => (
                <li key={index} className="py-2 flex justify-between items-center">
                  <span>
                    {person.name} - Paid: ₹{person.amountPaid.toFixed(2)}
                  </span>
                  <div>
                    <button
                      onClick={() => handleEditPerson(index)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePerson(index)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div ref={summaryRef} className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700">Summary</h3>
          <p>Total Expenses: ₹{total}</p>
          {overBudget && (
            <p className="text-red-600">Warning: Total expenses exceed the budget!</p>
          )}
          <p>Number of People: {people.length}</p>
          <p>Per Person Share: ₹{perPersonShare.toFixed(2)}</p>
        </div>

        <div className="mt-4">
          <h4 className="font-medium text-gray-600 mb-2">Balance Sheet</h4>
          {balances.map((person, index) => (
            <div key={index} className="border-b py-2">
              <p>
                {person.name} paid ₹{person.paid} &mdash; {
                  person.owes > 0
                    ? `owes ₹${person.owes.toFixed(2)}`
                    : `gets back ₹${Math.abs(person.owes).toFixed(2)}`
                }
              </p>
            </div>
          ))}
        </div>

        {transactions.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-600 mb-2">Who Pays Whom (Settlement)</h4>
            {transactions.map((line, index) => (
              <p key={index} className="text-sm text-gray-700">{line}</p>
            ))}
          </div>
        )}

        <div className="mt-6 text-right">
          <button
            onClick={handleExportCSV}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Export to CSV
          </button>
        </div>
      </div>
    </div>
  );
}

export default BudgetPage;