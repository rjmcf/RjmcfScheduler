function createDropDown(id)
{
	const select = document.createElement("select");
	select.id = id;

	const defaultOption = document.createElement("option");
	const defaultText = document.createTextNode("-");
	defaultOption.appendChild(defaultText);
	select.appendChild(defaultOption);

	for (let h = 9; h < 24; h++)
	{
		for (let m = 0; m < 60; m += 15)
		{
			const option = document.createElement("option");
			const timeToAdd = `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}`;
			const optionText = document.createTextNode(timeToAdd);
			option.appendChild(optionText);
			select.appendChild(option);
		}
	}

	// Add final midnight option
	const option = document.createElement("option");
	const optionText = document.createTextNode("00:00");
	option.appendChild(optionText);
	select.appendChild(option);

	return select;
}

function createNewTimeSelect(idToAddTo)
{
	const para = document.createElement("p");
	para.id = idToAddTo + "Selector";
	para.style.display = "none";

	const selectFrom = createDropDown(`${idToAddTo}From`);

	para.appendChild(selectFrom);

	const toText = document.createTextNode(" 'till ");
	para.appendChild(toText);

	const selectTo = createDropDown(`${idToAddTo}To`);

	para.appendChild(selectTo);

	document.getElementById(idToAddTo).appendChild(para);
}

function addDays(date, days)
{
  	var result = new Date(date);
  	result.setDate(result.getDate() + days);
	return result;
}

function setUpTable(numWeeks)
{
	const table = document.getElementById("dateTable");
	for (let week = 0; week < numWeeks; week++)
	{
		const row = document.createElement("tr");
		for (let day = 0; day < 7; day++)
		{
			const cell = document.createElement("td");
			cell.id = `Day${week}${day}`;
			row.appendChild(cell);
		}
		table.appendChild(row);
	}
}

function setAvailable(cellId)
{
	const selectorId = cellId + "Selector";
	const selector = document.getElementById(selectorId);

	const checkboxId = cellId + "Check";
	const checkBox = document.getElementById(checkboxId);

	if (checkBox.checked == true)
	{
    	selector.style.display = "block";
  	}
  	else
  	{
    	selector.style.display = "none";
  	}
}

function submit()
{
	let isValid = true;
	let invalidDayIndices = [];
	let sameTimeIndices = [];
	let timeOutOfOrderIndices = [];
	// To fix JS handling of mods of -ve numbers
	let dayNum = (((firstDay.getDay() - 1)%7)+7)%7;
	let weekNum = 0;
	let results = [];
	for (let i = 0; i < numDays; i++)
	{
		if (i>0)
		{
			dayNum = (dayNum+1)%7;
		}
		if (dayNum == 0 && i > 0)
	  	{
	  		weekNum++;
	  	}
		const cellId = `Day${weekNum}${dayNum}`;
		const checkBox = document.getElementById(`${cellId}Check`);
		if (checkBox.checked == false)
		{
			results.push({available:false});
			continue;
		}

		const fromSelector = document.getElementById(`${cellId}From`);
		const toSelector = document.getElementById(`${cellId}To`);

		if (fromSelector.value === "-" || toSelector.value === "-")
		{
			isValid = false;
			invalidDayIndices.push(i);
			continue;
		}

		if (fromSelector.value === toSelector.value)
		{
			isValid = false;
			sameTimeIndices.push(i);
			continue;
		}

		if (fromSelector.value > toSelector.value && toSelector.value !== "00:00")
		{
			isValid = false;
			timeOutOfOrderIndices.push(i);
			continue;
		}

		results.push({available:true, from:fromSelector.value, to:toSelector.value});
	}

	if (isValid)
	{
		console.log(results);
	}
	else
	{
		if (invalidDayIndices.length)
		{
			alertInvalidDays(invalidDayIndices);
		}
		if (sameTimeIndices.length)
		{
			alertSameTimes(sameTimeIndices);
		}
		if (timeOutOfOrderIndices.length)
		{
			alertTimesOutOfOrder(timeOutOfOrderIndices);
		}
	}
}

function alertInvalidDays(invalidDayIndices)
{
	let string = "The following days have empty times:\n";
	string = addDaysToString(string, invalidDayIndices);
	string += "Please either select times for these days or mark yourself unavailable";
	alert(string);
}

function alertSameTimes(sameTimeIndices)
{
	let string = "The following days have identical start and end times:\n";
	string = addDaysToString(string, sameTimeIndices);
	string += "Please select different times for these days";
	alert(string);
}

function alertTimesOutOfOrder(timeOutOfOrderIndices)
{
	let string = "The following days have their times out of order:\n";
	string = addDaysToString(string, timeOutOfOrderIndices);
	string += "Please make sure the end time is after the start time";
	alert(string);
}

function addDaysToString(string, dayIndices)
{
	const dateTimeFormat = new Intl.DateTimeFormat('en', {month: 'short', day: '2-digit'});
	dayIndices.forEach((item, index) =>
	{
		const badDay = addDays(firstDay, item);
		const [{ value: month },,{ value: day }] = dateTimeFormat.formatToParts(badDay);
		string += `    ${day} ${month}\n`;
	});
	return string;
}

window.onload = function()
{
	// To fix JS handling of mods of -ve numbers
	let dayNum = (((firstDay.getDay() - 1)%7)+7)%7;
	// -1 to avoid double counting first day, +1 to make weeks 1-indexed
	const numWeeks = Math.floor((dayNum + numDays - 1) / 7) + 1;
	setUpTable(numWeeks);

	let week = 0;

	for (let i = 0; i < numDays; i++)
	{
		const currentDay = addDays(firstDay, i);
		// To fix JS handling of mods of -ve numbers
	  	dayNum = (((currentDay.getDay() - 1)%7)+7)%7;

	  	if (dayNum == 0 && i > 0)
	  	{
	  		week++;
	  	}

	  	const id = "Day" + week + dayNum;

        const dateTimeFormat = new Intl.DateTimeFormat('en', {month: 'short', day: '2-digit'});
		const [{ value: month },,{ value: day }] = dateTimeFormat.formatToParts(currentDay);

		const para = document.createElement("p");
		const dateText = document.createTextNode(`${day} ${month}`);
		para.appendChild(dateText);
		const elementToAddTo = document.getElementById(id);
		elementToAddTo.appendChild(para);

		const checkBoxLine = document.createElement("p");
		checkBoxLine.appendChild(document.createTextNode("Available"));
		const check = document.createElement("input");
		check.id = id + "Check";
		check.type = "checkbox";
		check.onclick = function() { setAvailable(id); }
		checkBoxLine.appendChild(check);
		elementToAddTo.appendChild(checkBoxLine);

		createNewTimeSelect(id);
	}
};
