import _ from 'lodash';
import Bluebird from 'bluebird';

import * as Tasks from '../../website/server/models/task';
import { model as Challenges } from '../../website/server/models/challenge';

let tasks = [
  // {
  //   "shortName": "Power Quality & Reliability",
  //   "question": "Promptly restore power after an outage",
  //   "text": "**Your Role in More Prompt Restoration.** Restoring power promptly after an outage is a big job that involves all employees regardless of their role. Note an example of how you specifically can support more prompt restoration in the pop up screen.",
  //   "notes": "",
  //   "repeatable": "No",
  //   "value": 20,
  //   "challengeId": "de61fb54-d200-42bc-a917-70b70d8cd408",
  //   "type": "habit"
  // },
  {
    "shortName": "Power Quality & Reliability",
    "question": "Provide quality electric power (spikes, drops, surges)",
    "text": "**We Power Lives Every Day.** [Watch this video]( https://drive.google.com/file/d/0B-DpKyEwPn_SbjI0MUlDZGdXc0E/view?usp=sharing) to see how one of our teams worked together to restore a nursing home. If you have a story, share it with us in an email to <ExperiencingComEd@exeloncorp.com>.",
    "notes": "",
    "repeatable": "No",
    "value": 5,
    "challengeId": "de61fb54-d200-42bc-a917-70b70d8cd408",
    "type": "habit"
  },
  {
    "shortName": "Power Quality & Reliability",
    "question": "Avoid brief interruptions of 5 minutes or less",
    "text": "**Outage vs Interruption Video.** Understand the difference between a brief interruption (5 minutes or less) and a lengthy outage (more than 5 minutes). Submit a short video to <ExperiencingComEd@exeloncorp.com> describing the differences and why they might happen. *Approved videos may be posted to social media*.",
    "notes": "Take the lead! Complete this task worth 50 points!",
    "repeatable": "No",
    "value": 50,
    "challengeId": "de61fb54-d200-42bc-a917-70b70d8cd408",
    "type": "habit"
  },
  {
    "shortName": "Price",
    "question": "Total monthly cost of your electric service",
    "text": "**Take a picture of yourself** next to an appliance with a sign showing how much it costs to run it in a normal month. Post it to your favorite social media channel like [Facebook](https://www.facebook.com/), [Twitter](https://twitter.com/), [Instagram](https://www.instagram.com/) or [Pinterest](https://www.pinterest.com/) and use tags *@ComEd, #DollarPower, #Emp*.",
    "notes": "Selfie? Yes please!",
    "repeatable": "No",
    "value": 40,
    "challengeId": "033c5270-0cc6-4a51-b62d-e61450d1fde8",
    "type": "habit"
  },
  {
    "shortName": "Price",
    "question": "Effort to help you manage your monthly usage",
    "text": "**AMI Benefits?** Can you describe the benefits of a smart meter (AMI) to a customer? Write your explanation to a customer in the pop-up.",
    "notes": "",
    "repeatable": "No",
    "value": 20,
    "challengeId": "033c5270-0cc6-4a51-b62d-e61450d1fde8",
    "type": "habit"
  },
  {
    "shortName": "Billing",
    "question": "Variety of methods to pay your bill",
    "text": "**Ways to Pay on social media!** Post a few of the [convenient ways to pay your ComEd bill](https://www.comed.com/MyAccount/CustomerSupport/Pages/CustomerGuides.aspx) to social media and use tags *@ComEd, #Waystopay, #Emp*.",
    "notes": "",
    "repeatable": "No",
    "value": 20,
    "challengeId": "cb0c29f1-7468-4126-876e-f6b97881016a",
    "type": "habit"
  },
  {
    "shortName": "Billing",
    "question": "Ease of paying your bill",
    "text": "**EPAY signup!** Encourage a friend or family member to [Sign up for EPAY](https://www.comed.com/MyAccount/MyBillUsage/Pages/ARCHIVE/PayMyBill.aspx). If you haven't signed up yet, do so.",
    "notes": "Easy points with ePay!",
    "repeatable": "No",
    "value": 20,
    "challengeId": "cb0c29f1-7468-4126-876e-f6b97881016a",
    "type": "habit"
  },
  {
    "shortName": "Corporate Citizenship",
    "question": "Involvement in local charities and civic organizations",
    "text": "**Participate in a ComEd Charity or Organization Event!** [Log your volunteer hours](https://energyforthecommunity.angelpointsevs.com/handlers/login.aph), and download the [Energy for the Community Mobile App](http://myexelon.exeloncorp.com/Exelon/CommunityRelations/Documents/Download%20Mobile%20App-%202%20pager.pdf).",
    "notes": "Log your hours, load up on 50 points!",
    "repeatable": "Yes",
    "value": 50,
    "challengeId": "e1661681-d25c-4471-a4cb-e6eb25915f66",
    "type": "habit"
  },
  {
    "shortName": "Corporate Citizenship",
    "question": "Involvement in local charities and civic organizations",
    "text": "**Attend any Volunteer Event** wearing a ComEd t-shirt and post a picture of yourself on social media like [Facebook](https://www.facebook.com/), [Twitter](https://twitter.com/), [Instagram](https://www.instagram.com/) or [Pinterest](https://www.pinterest.com/). Don't forget to bring some of your coworkers too! Make sure to use tags *@ComEd, #ComEdVolunteers, or #WeAreComEd*!",
    "notes": "You’ll look great in ComEd Red and at the top of the leaderboard with these easy 40 points.",
    "repeatable": "Yes",
    "value": 40,
    "challengeId": "e1661681-d25c-4471-a4cb-e6eb25915f66",
    "type": "habit"
  },
  {
    "shortName": "Corporate Citizenship",
    "question": "Efforts to develop energy supply plans for the future",
    "text": "**Future Energy Jobs Act.** What’s exciting at ComEd? The future Energy Jobs Act. [Read about this law]( http://teamapps.exeloncorp.com/sites/ITAcademy/Public%20Documents/FutureEnergyJobsAct.pdf) and note what interests you most in the pop up.",
    "notes": "Read all about it for 50 points!",
    "repeatable": "No",
    "value": 50,
    "challengeId": "e1661681-d25c-4471-a4cb-e6eb25915f66",
    "type": "habit"
  },
  {
    "shortName": "Communications",
    "question": "Efforts to communicate changes that might affect you",
    "text": "**Powering Lives Network Story.** The Powering Lives Network is a great resource for getting engaging and meaningful content in front of our customers, particularly when it comes to changes or innovations in our business that could affect them. Submit your idea for a story in the pop up.",
    "notes": "Write your way to stardom! Submit your ideas and find fame on the leaderboards with 30 points!",
    "repeatable": "No",
    "value": 30,
    "challengeId": "0afd0d36-39e4-49a0-ad2f-fa7479df99e9",
    "type": "habit"
  },
  {
    "shortName": "Communications",
    "question": "Usefulness of suggestions to reduce your monthly bill",
    "text": "**Post Bill Insert on Social Media!** Look for an Energy Efficiency insert in your monthly bill.  Take a picture and post it to social media. Tell your friends they could be saving too!",
    "notes": "These points might as well be hand-delivered to you! Be sure to scoop them up.",
    "repeatable": "No",
    "value": 15,
    "challengeId": "0afd0d36-39e4-49a0-ad2f-fa7479df99e9",
    "type": "habit"
  },
  {
    "shortName": "Communications",
    "question": "Communicating how to be safe around electricity",
    "text": "**Rap about it!** Access your inner poet/singer and write a rap about safety. Record an individual or team rap and send it to <ExperiencingComEd@exeloncorp.com>. *Best raps will be shared on social media and employee screens!*",
    "notes": "Tap in to your creative side for 50 points!",
    "repeatable": "No",
    "value": 50,
    "challengeId": "0afd0d36-39e4-49a0-ad2f-fa7479df99e9",
    "type": "habit"
  },
  {
    "shortName": "Customer Service",
    "question": "Ease of navigating the website (web)",
    "text": "**Follow ComEd** on [Facebook](https://www.facebook.com/ComEd/), [Twitter](https://twitter.com/ComEd), [Instagram](https://www.instagram.com/commonwealthedison/), [LinkedIn](https://www.linkedin.com/company/comed) or [YouTube](https://www.youtube.com/user/CommonwealthEdison).",
    "notes": "You’re one click away from 10 points!",
    "repeatable": "No",
    "value": 10,
    "challengeId": "d9f86ef5-46ea-4634-acee-ac4aff67b89d",
    "type": "habit"
  },
  {
    "shortName": "Customer Service",
    "question": "Representative's concern for your needs",
    "text": "**CARE for Customers.** Review how we [CARE for our customers](http://www.comed.com/MyAccount/CustomerSupport/Pages/AssistancePrograms.aspx) who need assistance at ComEd!",
    "notes": "Take pride in how ComEd is helping people and treat yourself to 20 points.",
    "repeatable": "No",
    "value": 20,
    "challengeId": "d9f86ef5-46ea-4634-acee-ac4aff67b89d",
    "type": "habit"
  }
];

module.exports = async function uploadTasks () {
  let tasksGroupedByChallenge = _.groupBy(tasks, 'challengeId');
  let challengeIds = _.uniq(_.keys(tasksGroupedByChallenge));
  
  let challenges = await Challenges.find({_id: challengeIds}).exec();
  let challengesById = _.groupBy(challenges, '_id');
  // @TODO: We could iterate through the tasksGroupedByChallenge but we need to sanatize the tasks
  let taskPromises = [];
  tasks.forEach(async (task) => {
    let shortName = task.shortName;
    let taskSanatized = new Tasks[`${task.type}`](Tasks.Task.sanitize(task));
    
    taskSanatized.challenge = {
      id: task.challengeId,
      shortName,
    };
    await taskSanatized.save();
    let challengeToAddTask = challengesById[task.challengeId];

    if (challengeToAddTask[0]) taskPromises.push(challengeToAddTask[0].addTasks([taskSanatized]));
  });

  try {
    let taskedSaved = await Bluebird.all(taskPromises)
  } catch (e) {
    console.log(e)
  }
  
}