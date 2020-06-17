let numTimes = {};
let textPara;
let submitButton;
const dateTimeFormat = new Intl.DateTimeFormat('en', {month: 'short', day: '2-digit'});

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
	const timeIndex = numTimes[idToAddTo];

	const para = document.createElement("p");
	para.id = `${idToAddTo}Selector${timeIndex}`;

	if (timeIndex > 0)
	{
		para.appendChild(document.createTextNode("and"));
	}

	const selectFrom = createDropDown(`${idToAddTo}From${timeIndex}`);

	para.appendChild(selectFrom);

	const toText = document.createTextNode(" 'till ");
	para.appendChild(toText);

	const selectTo = createDropDown(`${idToAddTo}To${timeIndex}`);

	para.appendChild(selectTo);

	if (timeIndex > 0)
	{
		const deleteButton = document.createElement("button");
		deleteButton.appendChild(document.createTextNode("Delete"));
		deleteButton.onclick = function()
		{
			const paraToDelete = document.getElementById(`${idToAddTo}Selector${timeIndex}`);
			paraToDelete.parentNode.removeChild(paraToDelete);
		}
		para.appendChild(deleteButton);
	}

	document.getElementById(`${idToAddTo}Selectors`).appendChild(para);

	numTimes[idToAddTo]++;
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
	const selectorId = cellId + `Scroll`;
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
	if (validateData())
	{
		processData();
	}
}

function validateData()
{
	const nameInput = document.getElementById("nameInput");
	const username = nameInput.value.trim();
	if (username === "")
	{
		alert("Please enter your name!");
		setErrorText("Please enter your name!");
		return false;
	}

	// To fix JS handling of mods of -ve numbers
	let dayNum = (((firstDay.getDay() - 1)%7)+7)%7;
	let weekNum = 0;
	let results = [];

	let isValid = true;
	let invalidDayIndices = new Set();
	let sameTimeIndices = new Set();
	let timeOutOfOrderIndices = new Set();
	let overlappingTimeSlotIndices = new Set();

	for (let i = 0; i < numDays; i++)
	{
		// Update counters
		if (i>0)
		{
			dayNum = (dayNum+1)%7;
		}
		if (dayNum == 0 && i > 0)
	  	{
	  		weekNum++;
	  	}

		if (dayIndicesToSkip.includes(i))
		{
			continue;
		}

		const cellId = `Day${weekNum}${dayNum}`;
		const checkBox = document.getElementById(`${cellId}Check`);
		if (checkBox.checked == false)
		{
			continue;
		}

		orderedByStartTimes = [];
		for (let timeIndex = 0; timeIndex < numTimes[cellId]; timeIndex++)
		{
			const fromSelector = document.getElementById(`${cellId}From${timeIndex}`);
			const toSelector = document.getElementById(`${cellId}To${timeIndex}`);

			if (fromSelector === null || toSelector === null)
			{
				continue;
			}

			// Check for errors in entry
			if (fromSelector.value === "-" || toSelector.value === "-")
			{
				isValid = false;
				invalidDayIndices.add(i);
				continue;
			}

			if (fromSelector.value === toSelector.value)
			{
				isValid = false;
				sameTimeIndices.add(i);
				continue;
			}

			if (ltForTimes(toSelector.value, fromSelector.value))
			{
				isValid = false;
				timeOutOfOrderIndices.add(i);
				continue;
			}

			insertIntoSorted({from: fromSelector.value,to: toSelector.value}, orderedByStartTimes);
		}

		if (hasOverlaps(orderedByStartTimes))
		{
			isValid = false;
			overlappingTimeSlotIndices.add(i);
		}
	}

	if (isValid)
	{
		return true;
	}

	let errorText = "Things to fix:\n\n";
	if (invalidDayIndices.size)
	{
		errorText += alertInvalidDays(invalidDayIndices) + "\n\n";
	}
	if (sameTimeIndices.size)
	{
		errorText += alertSameTimes(sameTimeIndices) + "\n\n";
	}
	if (timeOutOfOrderIndices.size)
	{
		errorText += alertTimesOutOfOrder(timeOutOfOrderIndices) + "\n\n";
	}
	if (overlappingTimeSlotIndices.size)
	{
		errorText += alertOverlappingTimeSlots(overlappingTimeSlotIndices);
	}
	errorText = errorText.replace(/\n/g, "<br>");
	setErrorText(errorText);
	return false;
}

function processData()
{
	// To fix JS handling of mods of -ve numbers
	let dayNum = (((firstDay.getDay() - 1)%7)+7)%7;
	let weekNum = 0;
	let results = [];
	for (let i = 0; i < numDays; i++)
	{
		// Update counters
		if (i>0)
		{
			dayNum = (dayNum+1)%7;
		}
		if (dayNum == 0 && i > 0)
	  	{
	  		weekNum++;
	  	}

		// If we're skipping this day, they aren't available
		if (dayIndicesToSkip.includes(i))
		{
			results.push({available:false});
			continue;
		}

		// If they didn't tick Available, they aren't available
		const cellId = `Day${weekNum}${dayNum}`;
		const checkBox = document.getElementById(`${cellId}Check`);
		if (checkBox.checked == false)
		{
			results.push({available:false});
			continue;
		}

		let result = {available:true, times:[]};

		for (let timeIndex = 0; timeIndex < numTimes[cellId]; timeIndex++)
		{
			const fromSelector = document.getElementById(`${cellId}From${timeIndex}`);
			const toSelector = document.getElementById(`${cellId}To${timeIndex}`);

			if (fromSelector === null || toSelector === null)
			{
				continue;
			}

			// Other wise record results
			insertIntoSorted({from:fromSelector.value, to:toSelector.value}, result.times);
		}

		results.push(result);
	}

	const nameInput = document.getElementById("nameInput");
	const username = nameInput.value.trim();

	const output =
	{
		name: username,
		firstDay: firstDay,
		availability: results
	};
	const outputString = JSON.stringify(output);

	if (printToConsole)
	{
		console.log(outputString);
	}

	if (!disableEmails)
	{
		sendEmail(username, outputString);
	}
}

function sendEmail(name, stringToSend)
{
	setErrorText("Sending...");
	submitButton.disabled = true;

	Email.send({
	SecureToken: "4be1c4e8-32e9-4820-8ef1-78ff280be5f6",
	To : 'rjmcf@live.co.uk',
	From : "rjmcf.scheduler@gmail.com",
	Subject : `${name}'s Availability`,
	Body : stringToSend,
	}).then(
		message =>
		{
			if (message === "OK")
			{
				reportEmailSuccess(name);
			}
			else
			{
				reportEmailFail(name, message);
			}
		}
	);
}

function reportEmailSuccess(name)
{
	alert(`Availability submitted successfully. Thanks ${name}!`);

	setErrorText(`Data sent successfully, thanks ${name}!`);
	submitButton.disabled = false;
}

function reportEmailFail(name, message)
{
	alert(`"${message}"\nHmmm, looks like there's been a problem! Let Robin know and send him a screenshot of this error!`);

	setErrorText(`Uh oh! Something went wrong! Please send Robin the following message: "${message}".`);
	submitButton.disabled = false;
}

function alertInvalidDays(invalidDayIndices)
{
	let string = "The following days have empty times:\n";
	string = addDaysToString(string, invalidDayIndices);
	string += "Please either select times for these days or mark yourself unavailable";
	alert(string);
	return string;
}

function alertSameTimes(sameTimeIndices)
{
	let string = "The following days have identical start and end times:\n";
	string = addDaysToString(string, sameTimeIndices);
	string += "Please select different times for these days";
	alert(string);
	return string;
}

function alertTimesOutOfOrder(timeOutOfOrderIndices)
{
	let string = "The following days have their times out of order:\n";
	string = addDaysToString(string, timeOutOfOrderIndices);
	string += "Please make sure the end time is after the start time";
	alert(string);
	return string;
}

function alertOverlappingTimeSlots(overlappingTimeSlotIndices)
{
	let string = "The following days have overlapping time slots:\n";
	string = addDaysToString(string, overlappingTimeSlotIndices);
	string += "Please make sure that no time slots overlap";
	alert(string);
	return string;
}

function addDaysToString(string, dayIndices)
{
	dayIndices.forEach((item) =>
	{
		const badDay = addDays(firstDay, item);
		const [{ value: month },,{ value: day }] = dateTimeFormat.formatToParts(badDay);
		string += `- ${day} ${month}\n`;
	});
	return string;
}

function ltForTimes(time1, time2)
{
	if (time1 === time2)
	{
		return false;
	}

	if (time1 === "00:00")
	{
		return false;
	}

	if (time2 === "00:00")
	{
		return true;
	}

	return time1 < time2;
}

function minTime(time1, time2)
{
	return ltForTimes(time1, time2) ? time1 : time2;
}

function maxTime(time1, time2)
{
	return ltForTimes(time1, time2) ? time2 : time1;
}

function insertIntoSorted(timeSlot, sorted)
{
	for (let i = 0; i < sorted.length; i++)
	{
		if (ltForTimes(timeSlot.from, sorted[i].from))
		{
			sorted.splice(i, 0, timeSlot);
			return;
		}
	}

	sorted.push(timeSlot);
}

function hasOverlaps(sortedTimeSlots)
{
	for (let i = 0; i < sortedTimeSlots.length; i++)
	{
		for (let j = i + 1; j < sortedTimeSlots.length; j++)
		{
			if (
				ltForTimes(
					maxTime(sortedTimeSlots[i].from, sortedTimeSlots[j].from),
					minTime(sortedTimeSlots[i].to, sortedTimeSlots[j].to)
				)
			)
			{
				return true;
			}
		}
	}

	return false;
}

function setErrorText(text)
{
	textPara.innerHTML = "";

	const t = text.split(/\s*<br ?\/?>\s*/i);
	if(t[0].length > 0)
	{
		textPara.appendChild(document.createTextNode(t[0]));
	}
	for(let i = 1; i < t.length; i++)
	{
		textPara.appendChild(document.createElement('br'));
		if(t[i].length > 0)
		{
	  		textPara.appendChild(document.createTextNode(t[i]));
		}
	}
}

window.onload = function()
{
	textPara = document.getElementById("emailReport");

	submitButton = document.getElementById("submitButton");

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

		const [{ value: month },,{ value: day }] = dateTimeFormat.formatToParts(currentDay);

		const para = document.createElement("p");
		const dateText = document.createTextNode(`${day} ${month}`);
		para.appendChild(dateText);
		const elementToAddTo = document.getElementById(id);
		elementToAddTo.appendChild(para);

		if (!dayIndicesToSkip.includes(i))
		{
			const checkBoxLine = document.createElement("p");
			checkBoxLine.appendChild(document.createTextNode("Free"));
			const check = document.createElement("input");
			check.id = id + "Check";
			check.type = "checkbox";
			check.onclick = function() { setAvailable(id); };
			checkBoxLine.appendChild(check);
			elementToAddTo.appendChild(checkBoxLine);

			numTimes[id] = 0;
			const scrollDiv = document.createElement("div");
			scrollDiv.style.display = "none";
			scrollDiv.id = `${id}Scroll`;
			scrollDiv.className = "cell-wrapper";

			const selectorDiv = document.createElement("div");
			selectorDiv.id = `${id}Selectors`;
			scrollDiv.appendChild(selectorDiv);
			elementToAddTo.appendChild(scrollDiv);

			createNewTimeSelect(id);

			const addSelectorButton = document.createElement("button");
			addSelectorButton.appendChild(document.createTextNode("Add Times"));
			addSelectorButton.onclick = function() {createNewTimeSelect(id); };
			scrollDiv.appendChild(addSelectorButton);
		}
	}
};
