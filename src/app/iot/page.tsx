'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QuizStartPopup from '@/components/QuizStartPopup'
import QuizTimer from '@/components/QuizTimer'
import { useQuizTracking } from '@/hooks/useQuizTracking'

// ─── Types ───────────────────────────────────────────
interface Section {
  id: number
  title: string
  marks: string
  icon: string
  questions: Question[]
}

interface Question {
  id: number
  text: string
  marks: string
  type: 'code' | 'trace' | 'fill' | 'mcq' | 'tf'
  codeBlock?: string
  fillItems?: { label: string; answer: string }[]
  mcqOptions?: { letter: string; text: string; isCorrect: boolean }[]
  answer: string
  answerCode?: string
  hint?: string
}

// ─── Data ────────────────────────────────────────────
const sections: Section[] = [
  {
    id: 1,
    title: 'Introduction to IoT',
    marks: '15 pts',
    icon: '🌐',
    questions: [
      {
        id: 1,
        text: 'IoT stands for:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Internet of Tools', isCorrect: false },
          { letter: 'B', text: 'Internet of Things', isCorrect: true },
          { letter: 'C', text: 'International Online Technology', isCorrect: false },
          { letter: 'D', text: 'Integrated Operating Transmission', isCorrect: false },
        ],
        answer: 'IoT stands for Internet of Things — a network of physical devices connected to the internet to collect and exchange data.',
      },
      {
        id: 2,
        text: 'Which statement best describes IoT?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'A network only for computers', isCorrect: false },
          { letter: 'B', text: 'A network of physical devices connected to the internet to collect/exchange data', isCorrect: true },
          { letter: 'C', text: 'A collection of websites hosted online', isCorrect: false },
          { letter: 'D', text: 'A method for faster typing on phones', isCorrect: false },
        ],
        answer: 'IoT is best described as a network of physical devices connected to the internet to collect and exchange data.',
      },
      {
        id: 3,
        text: 'Which of the following can be considered an IoT "Thing"?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'A notebook paper', isCorrect: false },
          { letter: 'B', text: 'A standard chair', isCorrect: false },
          { letter: 'C', text: 'A temperature sensor device connected to a network', isCorrect: true },
          { letter: 'D', text: 'A pencil', isCorrect: false },
        ],
        answer: 'A temperature sensor device connected to a network qualifies as an IoT "Thing" because it can collect data and communicate over the internet.',
      },
      {
        id: 4,
        text: 'Which of the following is an actuator?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Soil moisture sensor', isCorrect: false },
          { letter: 'B', text: 'Gas sensor', isCorrect: false },
          { letter: 'C', text: 'Relay module', isCorrect: true },
          { letter: 'D', text: 'Thermometer', isCorrect: false },
        ],
        answer: 'A relay module is an actuator — it performs an action (switching) based on a command. Sensors only measure/collect data.',
      },
      {
        id: 5,
        text: 'The main job of a sensor is to:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Store data in the cloud', isCorrect: false },
          { letter: 'B', text: 'Measure/collect data from the environment', isCorrect: true },
          { letter: 'C', text: 'Display data on the mobile screen', isCorrect: false },
          { letter: 'D', text: 'Turn devices on and off', isCorrect: false },
        ],
        answer: 'The main job of a sensor is to measure and collect data from the physical environment.',
      },
      {
        id: 6,
        text: 'The main job of an actuator is to:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Measure temperature', isCorrect: false },
          { letter: 'B', text: 'Collect data', isCorrect: false },
          { letter: 'C', text: 'Perform an action based on a command', isCorrect: true },
          { letter: 'D', text: 'Encrypt the cloud database', isCorrect: false },
        ],
        answer: 'An actuator performs an action (like turning a motor on/off, opening a valve) based on a command it receives.',
      },
      {
        id: 7,
        text: 'In a typical IoT system, where is data commonly stored?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Only inside the sensor', isCorrect: false },
          { letter: 'B', text: 'In the cloud or server system', isCorrect: true },
          { letter: 'C', text: 'In the user interface only', isCorrect: false },
          { letter: 'D', text: 'Only inside the actuator', isCorrect: false },
        ],
        answer: 'In a typical IoT system, data is commonly stored in the cloud or server system for processing and access.',
      },
      {
        id: 8,
        text: 'Which component mainly allows the user to monitor and control the IoT system?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'User interface (mobile/web app)', isCorrect: true },
          { letter: 'B', text: 'Sensor', isCorrect: false },
          { letter: 'C', text: 'Motor', isCorrect: false },
          { letter: 'D', text: 'Battery', isCorrect: false },
        ],
        answer: 'The user interface (mobile/web app) allows the user to monitor and control the IoT system.',
      },
      {
        id: 9,
        text: 'Which of the following is the correct IoT system order?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'User Interface → Analytics → Cloud → Gateway → Device', isCorrect: false },
          { letter: 'B', text: 'Device → Gateway → Cloud → Analytics → User Interface', isCorrect: true },
          { letter: 'C', text: 'Cloud → Device → Analytics → Gateway → User Interface', isCorrect: false },
          { letter: 'D', text: 'Gateway → Cloud → User Interface → Device → Analytics', isCorrect: false },
        ],
        answer: 'The correct IoT system order is: Device → Gateway → Cloud → Analytics → User Interface.',
      },
      {
        id: 10,
        text: 'Smart irrigation systems mainly depend on sensing:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Soil moisture', isCorrect: true },
          { letter: 'B', text: 'Car speed', isCorrect: false },
          { letter: 'C', text: 'Screen brightness', isCorrect: false },
          { letter: 'D', text: 'Printer temperature', isCorrect: false },
        ],
        answer: 'Smart irrigation systems mainly depend on sensing soil moisture to determine when to water plants.',
      },
      {
        id: 11,
        text: 'Smart parking systems are mainly used to:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Increase phone battery life', isCorrect: false },
          { letter: 'B', text: 'Help drivers find free parking spaces', isCorrect: true },
          { letter: 'C', text: 'Measure air humidity only', isCorrect: false },
          { letter: 'D', text: 'Print parking tickets automatically without sensors', isCorrect: false },
        ],
        answer: 'Smart parking systems help drivers find free parking spaces using sensors that detect occupancy.',
      },
      {
        id: 12,
        text: 'Air pollution monitoring IoT systems mainly collect:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Heart rate values', isCorrect: false },
          { letter: 'B', text: 'Soil moisture values', isCorrect: false },
          { letter: 'C', text: 'Air quality / gas level readings', isCorrect: true },
          { letter: 'D', text: 'Car engine RPM', isCorrect: false },
        ],
        answer: 'Air pollution monitoring IoT systems mainly collect air quality and gas level readings from the environment.',
      },
      {
        id: 13,
        text: 'An important advantage of IoT in healthcare is:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Less need for sensors', isCorrect: false },
          { letter: 'B', text: 'Remote monitoring and faster response', isCorrect: true },
          { letter: 'C', text: 'No need for internet connection', isCorrect: false },
          { letter: 'D', text: 'Reducing the use of hospitals completely', isCorrect: false },
        ],
        answer: 'A key advantage of IoT in healthcare is remote monitoring and faster response to patient conditions.',
      },
      {
        id: 14,
        text: '"Connectivity" in IoT refers to:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'The size of the device', isCorrect: false },
          { letter: 'B', text: 'How devices communicate and send data', isCorrect: true },
          { letter: 'C', text: 'The color of the sensor', isCorrect: false },
          { letter: 'D', text: 'The temperature of the cloud', isCorrect: false },
        ],
        answer: 'Connectivity in IoT refers to how devices communicate and send data to each other and to the cloud.',
      },
      {
        id: 15,
        text: 'The phrase "Any device, anywhere, anytime" means:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'IoT works only indoors', isCorrect: false },
          { letter: 'B', text: 'IoT can be applied across many devices and locations', isCorrect: true },
          { letter: 'C', text: 'IoT works only with computers', isCorrect: false },
          { letter: 'D', text: 'IoT must use only one network type', isCorrect: false },
        ],
        answer: '"Any device, anywhere, anytime" means IoT can be applied across many types of devices and locations, providing ubiquitous connectivity.',
      },
    ],
  },
  {
    id: 2,
    title: 'IoT Architecture & Core Components',
    marks: '20 pts',
    icon: '🏗️',
    questions: [
      {
        id: 51,
        text: 'The IoT layer responsible for collecting data from the physical world is the:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Application Layer', isCorrect: false },
          { letter: 'B', text: 'Processing Layer', isCorrect: false },
          { letter: 'C', text: 'Network Layer', isCorrect: false },
          { letter: 'D', text: 'Perception (Sensor) Layer', isCorrect: true },
        ],
        answer: 'The Perception (Sensor) Layer is responsible for collecting data from the physical world using sensors and actuators.',
      },
      {
        id: 52,
        text: 'The IoT layer responsible for transmitting data between devices and servers is the:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Perception Layer', isCorrect: false },
          { letter: 'B', text: 'Application Layer', isCorrect: false },
          { letter: 'C', text: 'Network (Transport) Layer', isCorrect: true },
          { letter: 'D', text: 'Sensor Layer', isCorrect: false },
        ],
        answer: 'The Network (Transport) Layer is responsible for transmitting data between devices and servers using various communication protocols.',
      },
      {
        id: 53,
        text: 'The IoT layer responsible for storing and analyzing data is the:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Network Layer', isCorrect: false },
          { letter: 'B', text: 'Data Processing Layer', isCorrect: true },
          { letter: 'C', text: 'Application Layer', isCorrect: false },
          { letter: 'D', text: 'Perception Layer', isCorrect: false },
        ],
        answer: 'The Data Processing Layer is responsible for storing and analyzing data collected from sensors.',
      },
      {
        id: 54,
        text: 'The IoT layer that provides dashboards and mobile apps is the:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Application Layer', isCorrect: true },
          { letter: 'B', text: 'Processing Layer', isCorrect: false },
          { letter: 'C', text: 'Network Layer', isCorrect: false },
          { letter: 'D', text: 'Perception Layer', isCorrect: false },
        ],
        answer: 'The Application Layer provides dashboards, mobile apps, and user interfaces for interacting with the IoT system.',
      },
      {
        id: 55,
        text: 'A device that measures temperature is a:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Actuator', isCorrect: false },
          { letter: 'B', text: 'Sensor', isCorrect: true },
          { letter: 'C', text: 'Platform', isCorrect: false },
          { letter: 'D', text: 'Router', isCorrect: false },
        ],
        answer: 'A device that measures temperature is a sensor — it collects data from the physical environment.',
      },
      {
        id: 56,
        text: 'A device that turns a motor ON/OFF is a:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Sensor', isCorrect: false },
          { letter: 'B', text: 'Database', isCorrect: false },
          { letter: 'C', text: 'Actuator', isCorrect: true },
          { letter: 'D', text: 'Protocol', isCorrect: false },
        ],
        answer: 'A device that turns a motor ON/OFF is an actuator — it performs an action based on a command.',
      },
      {
        id: 57,
        text: 'Which of the following is an actuator?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Humidity sensor', isCorrect: false },
          { letter: 'B', text: 'Proximity sensor', isCorrect: false },
          { letter: 'C', text: 'Gas sensor', isCorrect: false },
          { letter: 'D', text: 'Valve', isCorrect: true },
        ],
        answer: 'A valve is an actuator — it performs a physical action (opening/closing) based on a command. The other options are sensors.',
      },
      {
        id: 58,
        text: 'Which of the following is best for short-range communication with low power?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: '4G/5G', isCorrect: false },
          { letter: 'B', text: 'Bluetooth', isCorrect: true },
          { letter: 'C', text: 'Ethernet', isCorrect: false },
          { letter: 'D', text: 'Satellite', isCorrect: false },
        ],
        answer: 'Bluetooth is best for short-range communication with low power consumption, commonly used for wearable and personal IoT devices.',
      },
      {
        id: 59,
        text: 'Which network is most suitable for long-range, low-power, small data transmission?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Wi-Fi', isCorrect: false },
          { letter: 'B', text: 'Bluetooth', isCorrect: false },
          { letter: 'C', text: 'LoRa / NB-IoT', isCorrect: true },
          { letter: 'D', text: 'HDMI', isCorrect: false },
        ],
        answer: 'LoRa and NB-IoT are LPWAN technologies designed for long-range, low-power, small data transmission in IoT applications.',
      },
      {
        id: 60,
        text: 'Which statement best describes real-time (hot) processing?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Data is stored for months before analysis', isCorrect: false },
          { letter: 'B', text: 'Decisions must happen quickly after data arrives', isCorrect: true },
          { letter: 'C', text: 'Data is never stored', isCorrect: false },
          { letter: 'D', text: 'Data is always processed once per year', isCorrect: false },
        ],
        answer: 'Real-time (hot) processing means decisions must happen quickly after data arrives, enabling immediate responses like alarms.',
      },
      {
        id: 61,
        text: 'Which statement best describes batch (cold) processing?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Immediate alarms and fast actions', isCorrect: false },
          { letter: 'B', text: 'Only used for emergency systems', isCorrect: false },
          { letter: 'C', text: 'Analysis happens later using stored data', isCorrect: true },
          { letter: 'D', text: 'Requires no storage', isCorrect: false },
        ],
        answer: 'Batch (cold) processing means analysis happens later using stored data, such as generating weekly or monthly reports.',
      },
      {
        id: 62,
        text: 'Arduino is best described as a:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Microprocessor-based computer board', isCorrect: false },
          { letter: 'B', text: 'Microcontroller-based board', isCorrect: true },
          { letter: 'C', text: 'Cloud platform', isCorrect: false },
          { letter: 'D', text: 'Network router', isCorrect: false },
        ],
        answer: 'Arduino is a microcontroller-based board designed for embedded control tasks and IoT prototyping.',
      },
      {
        id: 63,
        text: 'Raspberry Pi is best described as a:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Microcontroller board with no OS', isCorrect: false },
          { letter: 'B', text: 'Sensor module', isCorrect: false },
          { letter: 'C', text: 'Microprocessor-based board that can run an OS', isCorrect: true },
          { letter: 'D', text: 'Actuator controller only', isCorrect: false },
        ],
        answer: 'Raspberry Pi is a microprocessor-based board that can run a full operating system like Linux.',
      },
      {
        id: 64,
        text: 'Compared to microprocessors, microcontrollers are usually:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'More expensive and faster', isCorrect: false },
          { letter: 'B', text: 'Cheaper and designed for specific control tasks', isCorrect: true },
          { letter: 'C', text: 'Only used in laptops', isCorrect: false },
          { letter: 'D', text: 'Not used in IoT', isCorrect: false },
        ],
        answer: 'Microcontrollers are usually cheaper and designed for specific control tasks, making them ideal for IoT devices.',
      },
      {
        id: 65,
        text: 'A main IoT challenge for battery-powered devices is:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Screen brightness', isCorrect: false },
          { letter: 'B', text: 'Power consumption', isCorrect: true },
          { letter: 'C', text: 'Keyboard size', isCorrect: false },
          { letter: 'D', text: 'Speaker volume', isCorrect: false },
        ],
        answer: 'Power consumption is a main IoT challenge for battery-powered devices, as they need to operate for long periods on limited power.',
      },
      {
        id: 66,
        text: 'A main IoT challenge because many devices generate continuous data is:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Big Data', isCorrect: true },
          { letter: 'B', text: 'Small Data', isCorrect: false },
          { letter: 'C', text: 'No Data', isCorrect: false },
          { letter: 'D', text: 'Data deletion only', isCorrect: false },
        ],
        answer: 'Big Data is a main IoT challenge because many devices continuously generate massive amounts of data that need to be stored, processed, and analyzed.',
      },
      {
        id: 67,
        text: 'Security in IoT is important mainly because:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'IoT devices never connect to the internet', isCorrect: false },
          { letter: 'B', text: 'IoT devices can be accessed or controlled by attackers if unprotected', isCorrect: true },
          { letter: 'C', text: 'IoT devices cannot store data', isCorrect: false },
          { letter: 'D', text: 'IoT devices do not control anything physical', isCorrect: false },
        ],
        answer: 'Security in IoT is important because unprotected IoT devices can be accessed or controlled by attackers, potentially causing harm.',
      },
      {
        id: 68,
        text: 'An IoT platform is mainly used to:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Replace sensors completely', isCorrect: false },
          { letter: 'B', text: 'Provide services like device management, storage, dashboards, and integration', isCorrect: true },
          { letter: 'C', text: 'Only provide batteries', isCorrect: false },
          { letter: 'D', text: 'Only provide cables', isCorrect: false },
        ],
        answer: 'An IoT platform provides services like device management, storage, dashboards, and integration for building IoT solutions.',
      },
      {
        id: 69,
        text: 'The correct IoT loop is:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Act → Sense → Ignore', isCorrect: false },
          { letter: 'B', text: 'Sense → Decide → Act', isCorrect: true },
          { letter: 'C', text: 'Store → Delete → Repeat', isCorrect: false },
          { letter: 'D', text: 'Download → Print → Share', isCorrect: false },
        ],
        answer: 'The correct IoT loop is: Sense → Decide → Act — sensors collect data, the system processes and decides, then actuators perform actions.',
      },
      {
        id: 70,
        text: 'In IoT, the "Application Layer" mainly focuses on:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Physical measurement only', isCorrect: false },
          { letter: 'B', text: 'Internet cables only', isCorrect: false },
          { letter: 'C', text: 'User access, visualization, and control', isCorrect: true },
          { letter: 'D', text: 'Sensor manufacturing', isCorrect: false },
        ],
        answer: 'The Application Layer mainly focuses on user access, visualization, and control through dashboards and apps.',
      },
    ],
  },
  {
    id: 3,
    title: 'Sensors & Smart Sensors',
    marks: '20 pts',
    icon: '📡',
    questions: [
      {
        id: 101,
        text: 'Which statement BEST describes a sensor?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'A device that changes the environment', isCorrect: false },
          { letter: 'B', text: 'A device that measures the environment and outputs data', isCorrect: true },
          { letter: 'C', text: 'A device that stores data only', isCorrect: false },
          { letter: 'D', text: 'A device that connects to Wi-Fi only', isCorrect: false },
        ],
        answer: 'A sensor measures the environment and outputs data — it detects physical phenomena and converts them into readable signals.',
      },
      {
        id: 102,
        text: 'Which component converts a continuous real-world signal into numbers a microcontroller can process?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'DAC', isCorrect: false },
          { letter: 'B', text: 'ADC', isCorrect: true },
          { letter: 'C', text: 'UART', isCorrect: false },
          { letter: 'D', text: 'PWM', isCorrect: false },
        ],
        answer: 'ADC (Analog-to-Digital Converter) converts a continuous real-world analog signal into digital numbers a microcontroller can process.',
      },
      {
        id: 103,
        text: 'Which of the following is an actuator?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Humidity sensor', isCorrect: false },
          { letter: 'B', text: 'Gas sensor', isCorrect: false },
          { letter: 'C', text: 'Motor', isCorrect: true },
          { letter: 'D', text: 'Temperature sensor', isCorrect: false },
        ],
        answer: 'A motor is an actuator — it performs a physical action (rotation) based on a command. The other options are all sensors.',
      },
      {
        id: 104,
        text: 'A smart sensor is "smart" mainly because it can:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Only measure, nothing else', isCorrect: false },
          { letter: 'B', text: 'Measure and always needs a PC to work', isCorrect: false },
          { letter: 'C', text: 'Measure and do extra functions like processing/communication', isCorrect: true },
          { letter: 'D', text: 'Only work with batteries', isCorrect: false },
        ],
        answer: 'A smart sensor is "smart" because it can measure and perform extra functions like onboard processing and communication.',
      },
      {
        id: 105,
        text: 'Which layer of IoT is most related to sensors and actuators?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Application layer', isCorrect: false },
          { letter: 'B', text: 'Network layer', isCorrect: false },
          { letter: 'C', text: 'Perception (sensor) layer', isCorrect: true },
          { letter: 'D', text: 'Data processing layer', isCorrect: false },
        ],
        answer: 'The Perception (sensor) layer is most related to sensors and actuators — it interfaces directly with the physical world.',
      },
      {
        id: 106,
        text: 'The HC-SR04 ultrasonic sensor measures distance by:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Detecting infrared light', isCorrect: false },
          { letter: 'B', text: 'Measuring reflected sound wave time', isCorrect: true },
          { letter: 'C', text: 'Measuring air humidity', isCorrect: false },
          { letter: 'D', text: 'Detecting magnetic fields', isCorrect: false },
        ],
        answer: 'The HC-SR04 ultrasonic sensor measures distance by sending an ultrasonic pulse and measuring the time for the reflected sound wave to return.',
      },
      {
        id: 107,
        text: 'HC-SR04 pins: TRIG is usually connected to:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Arduino analog input', isCorrect: false },
          { letter: 'B', text: 'Arduino digital output', isCorrect: true },
          { letter: 'C', text: 'Arduino GND', isCorrect: false },
          { letter: 'D', text: 'Arduino VCC', isCorrect: false },
        ],
        answer: 'The TRIG pin of HC-SR04 is connected to an Arduino digital output pin — the MCU sends a trigger pulse to start measurement.',
      },
      {
        id: 108,
        text: 'HC-SR04 pins: ECHO is usually connected to:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Arduino digital input', isCorrect: true },
          { letter: 'B', text: 'Arduino analog input', isCorrect: false },
          { letter: 'C', text: 'Arduino VCC', isCorrect: false },
          { letter: 'D', text: 'Arduino reset pin', isCorrect: false },
        ],
        answer: 'The ECHO pin of HC-SR04 is connected to an Arduino digital input pin — the MCU reads the echo pulse duration to calculate distance.',
      },
      {
        id: 109,
        text: 'PIR motion sensor (HC-SR501) output is typically:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Analog value from 0 to 1023', isCorrect: false },
          { letter: 'B', text: 'Always HIGH', isCorrect: false },
          { letter: 'C', text: 'Digital: HIGH when motion detected, LOW otherwise', isCorrect: true },
          { letter: 'D', text: 'PWM signal', isCorrect: false },
        ],
        answer: 'The PIR sensor (HC-SR501) outputs a digital signal: HIGH when motion is detected, LOW otherwise.',
      },
      {
        id: 110,
        text: 'PIR sensors are most commonly used to detect:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Distance to a wall', isCorrect: false },
          { letter: 'B', text: 'Human/animal motion in an area', isCorrect: true },
          { letter: 'C', text: 'Soil moisture', isCorrect: false },
          { letter: 'D', text: 'Gas concentration level', isCorrect: false },
        ],
        answer: 'PIR (Passive Infrared) sensors are most commonly used to detect human or animal motion in an area by sensing body heat.',
      },
      {
        id: 111,
        text: 'Soil moisture sensor AOUT should connect to:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Arduino digital pin', isCorrect: false },
          { letter: 'B', text: 'Arduino analog pin', isCorrect: true },
          { letter: 'C', text: 'Arduino power pin', isCorrect: false },
          { letter: 'D', text: 'Arduino clock pin', isCorrect: false },
        ],
        answer: 'The soil moisture sensor AOUT (Analog Output) should connect to an Arduino analog pin to read the continuous moisture level.',
      },
      {
        id: 112,
        text: 'Which sensor output gives a continuous level (not only ON/OFF)?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Digital output only', isCorrect: false },
          { letter: 'B', text: 'Analog output (AOUT/AO)', isCorrect: true },
          { letter: 'C', text: 'GND pin', isCorrect: false },
          { letter: 'D', text: 'VCC pin', isCorrect: false },
        ],
        answer: 'Analog output (AOUT/AO) gives a continuous level, allowing measurement of varying quantities rather than just ON/OFF.',
      },
      {
        id: 113,
        text: 'A temperature sensor with 1-Wire communication uses:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Many data wires', isCorrect: false },
          { letter: 'B', text: 'Only one data line for communication', isCorrect: true },
          { letter: 'C', text: 'Only analog voltage output', isCorrect: false },
          { letter: 'D', text: 'Only Bluetooth', isCorrect: false },
        ],
        answer: 'A 1-Wire temperature sensor uses only one data line for communication, reducing wiring complexity.',
      },
      {
        id: 114,
        text: 'A DHT sensor (temperature + humidity) usually outputs:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Two separate analog voltages', isCorrect: false },
          { letter: 'B', text: 'One digital data signal pin', isCorrect: true },
          { letter: 'C', text: 'A PWM motor control signal', isCorrect: false },
          { letter: 'D', text: 'A speaker signal', isCorrect: false },
        ],
        answer: 'A DHT sensor outputs temperature and humidity data through one digital data signal pin using a custom protocol.',
      },
      {
        id: 115,
        text: 'Which output is best if you want an "alarm only" when gas exceeds a limit?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'AO (Analog Output)', isCorrect: false },
          { letter: 'B', text: 'DO (Digital Output)', isCorrect: true },
          { letter: 'C', text: 'VCC', isCorrect: false },
          { letter: 'D', text: 'GND', isCorrect: false },
        ],
        answer: 'DO (Digital Output) is best for a simple alarm — it outputs HIGH/LOW based on a threshold, making it easy to trigger an alarm.',
      },
      {
        id: 116,
        text: 'Which output is best if you want to estimate gas concentration level (low/medium/high)?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'AO (Analog Output)', isCorrect: true },
          { letter: 'B', text: 'DO (Digital Output)', isCorrect: false },
          { letter: 'C', text: 'GND', isCorrect: false },
          { letter: 'D', text: 'TRIG', isCorrect: false },
        ],
        answer: 'AO (Analog Output) provides a continuous voltage level that allows estimating the gas concentration level (low/medium/high).',
      },
      {
        id: 117,
        text: 'Which is the BEST match: "Distance measurement" → sensor type?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'PIR', isCorrect: false },
          { letter: 'B', text: 'Ultrasonic', isCorrect: true },
          { letter: 'C', text: 'DHT', isCorrect: false },
          { letter: 'D', text: 'Gas sensor', isCorrect: false },
        ],
        answer: 'Ultrasonic sensors (like HC-SR04) are best for distance measurement using sound wave reflection.',
      },
      {
        id: 118,
        text: 'If a module has pins VCC, GND, DATA, it is most likely:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'A digital communication sensor module (like DHT or 1-Wire sensor)', isCorrect: true },
          { letter: 'B', text: 'A motor driver', isCorrect: false },
          { letter: 'C', text: 'A power supply', isCorrect: false },
          { letter: 'D', text: 'A relay only', isCorrect: false },
        ],
        answer: 'A module with VCC, GND, and DATA pins is most likely a digital communication sensor module like DHT or a 1-Wire sensor.',
      },
      {
        id: 119,
        text: 'A good design choice for a battery-powered farm sensor far away is:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'High-speed Wi-Fi + camera', isCorrect: false },
          { letter: 'B', text: 'Low power sensor + LPWAN (LoRa/NB-IoT)', isCorrect: true },
          { letter: 'C', text: 'HDMI connection', isCorrect: false },
          { letter: 'D', text: 'Desktop PC + Ethernet only', isCorrect: false },
        ],
        answer: 'A low power sensor with LPWAN (LoRa/NB-IoT) is ideal for battery-powered remote farm sensors — providing long range with minimal power consumption.',
      },
      {
        id: 120,
        text: 'Which is an example of real-time (hot) processing in IoT?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Weekly humidity trend report', isCorrect: false },
          { letter: 'B', text: 'Monthly energy bill analysis', isCorrect: false },
          { letter: 'C', text: 'Fire/smoke detection that triggers an alarm immediately', isCorrect: true },
          { letter: 'D', text: 'Saving data and analyzing it after one semester', isCorrect: false },
        ],
        answer: 'Fire/smoke detection that triggers an alarm immediately is an example of real-time (hot) processing — decisions must happen quickly after data arrives.',
      },
    ],
  },
  {
    id: 4,
    title: 'Microcontrollers & ATmega16',
    marks: '30 pts',
    icon: '🔌',
    questions: [
      {
        id: 201,
        text: 'A microcontroller is "a small computer on a single chip used to control a device." Which option matches this definition?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'RAM', isCorrect: false },
          { letter: 'B', text: 'MCU', isCorrect: true },
          { letter: 'C', text: 'GPU', isCorrect: false },
          { letter: 'D', text: 'SSD', isCorrect: false },
        ],
        answer: 'MCU (Microcontroller Unit) matches the definition of "a small computer on a single chip used to control a device."',
      },
      {
        id: 202,
        text: 'A smart door reads keypad input, checks the password, then unlocks a motor. This is mainly an example of:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Cloud storage synchronization', isCorrect: false },
          { letter: 'B', text: 'Read → Process → Output control loop', isCorrect: true },
          { letter: 'C', text: 'High-speed video compression', isCorrect: false },
          { letter: 'D', text: 'Graphics rendering', isCorrect: false },
        ],
        answer: 'The smart door follows a Read → Process → Output control loop: reads input, processes the password check, then controls the motor output.',
      },
      {
        id: 203,
        text: 'Which statement best defines an embedded system?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Any device connected to the internet', isCorrect: false },
          { letter: 'B', text: 'Hardware + MCU + software for one dedicated function', isCorrect: true },
          { letter: 'C', text: 'A computer used for office work', isCorrect: false },
          { letter: 'D', text: 'A system that always runs Windows', isCorrect: false },
        ],
        answer: 'An embedded system is hardware + MCU + software designed for one dedicated function, like a washing machine controller.',
      },
      {
        id: 204,
        text: 'A washing machine controller is best classified as:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Supercomputer', isCorrect: false },
          { letter: 'B', text: 'Embedded system', isCorrect: true },
          { letter: 'C', text: 'Data center server', isCorrect: false },
          { letter: 'D', text: 'General-purpose computer', isCorrect: false },
        ],
        answer: 'A washing machine controller is an embedded system — it has hardware + MCU + software for one dedicated function.',
      },
      {
        id: 205,
        text: 'The MCU control loop repeats many times per second mainly to:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Store photos permanently', isCorrect: false },
          { letter: 'B', text: 'Respond quickly to inputs and control outputs', isCorrect: true },
          { letter: 'C', text: 'Increase screen size', isCorrect: false },
          { letter: 'D', text: 'Replace the power supply', isCorrect: false },
        ],
        answer: 'The MCU control loop repeats many times per second to respond quickly to inputs and control outputs in real-time.',
      },
      {
        id: 206,
        text: 'Which of the following is NOT a typical internal block of a microcontroller?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Timers', isCorrect: false },
          { letter: 'B', text: 'Mechanical keyboard', isCorrect: true },
          { letter: 'C', text: 'ADC', isCorrect: false },
          { letter: 'D', text: 'CPU', isCorrect: false },
        ],
        answer: 'A mechanical keyboard is NOT an internal block of a microcontroller. Timers, ADC, and CPU are all typical internal MCU blocks.',
      },
      {
        id: 207,
        text: 'The CPU in a microcontroller is responsible for:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Only powering the board', isCorrect: false },
          { letter: 'B', text: 'Executing instructions and controlling device behavior', isCorrect: true },
          { letter: 'C', text: 'Only storing long-term data', isCorrect: false },
          { letter: 'D', text: 'Only converting analog signals to digital', isCorrect: false },
        ],
        answer: 'The CPU executes instructions and controls device behavior — it is the brain of the microcontroller.',
      },
      {
        id: 208,
        text: 'Inside the CPU, the unit that performs arithmetic and logic operations is called:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Oscillator', isCorrect: false },
          { letter: 'B', text: 'GPIO', isCorrect: false },
          { letter: 'C', text: 'ALU', isCorrect: true },
          { letter: 'D', text: 'EEPROM', isCorrect: false },
        ],
        answer: 'The ALU (Arithmetic Logic Unit) performs arithmetic and logic operations inside the CPU.',
      },
      {
        id: 209,
        text: 'The CPU component that points to the next instruction to be executed is the:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'UART', isCorrect: false },
          { letter: 'B', text: 'DAC', isCorrect: false },
          { letter: 'C', text: 'Program Counter (PC)', isCorrect: true },
          { letter: 'D', text: 'ADC', isCorrect: false },
        ],
        answer: 'The Program Counter (PC) points to the next instruction to be executed by the CPU.',
      },
      {
        id: 210,
        text: '"Program memory stores the code and keeps it even after power is OFF." This refers to:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Cache only', isCorrect: false },
          { letter: 'B', text: 'Flash (Program Memory)', isCorrect: true },
          { letter: 'C', text: 'SRAM', isCorrect: false },
          { letter: 'D', text: 'Stack only', isCorrect: false },
        ],
        answer: 'Flash (Program Memory) stores the code and retains it even after power is OFF — it is non-volatile memory.',
      },
      {
        id: 211,
        text: 'When power is removed, temporary variables are lost. This memory is most likely:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'SD Card', isCorrect: false },
          { letter: 'B', text: 'SRAM (RAM)', isCorrect: true },
          { letter: 'C', text: 'EEPROM', isCorrect: false },
          { letter: 'D', text: 'Flash', isCorrect: false },
        ],
        answer: 'SRAM (RAM) is volatile memory — temporary variables are lost when power is removed.',
      },
      {
        id: 212,
        text: 'A device must save calibration settings even after power OFF and update them occasionally. Best memory type:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'PWM', isCorrect: false },
          { letter: 'B', text: 'SRAM', isCorrect: false },
          { letter: 'C', text: 'CPU registers', isCorrect: false },
          { letter: 'D', text: 'EEPROM', isCorrect: true },
        ],
        answer: 'EEPROM is best for saving calibration settings that must persist after power OFF and be updated occasionally — it is non-volatile and byte-erasable.',
      },
      {
        id: 213,
        text: 'A button is connected to a pin, and the MCU reads it as 0 or 1. That pin is used as:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Program memory', isCorrect: false },
          { letter: 'B', text: 'Analog-only output', isCorrect: false },
          { letter: 'C', text: 'Timer overflow', isCorrect: false },
          { letter: 'D', text: 'Digital input (GPIO input)', isCorrect: true },
        ],
        answer: 'When an MCU reads a button as 0 or 1, the pin is used as a digital input (GPIO input).',
      },
      {
        id: 214,
        text: 'An MCU pin turns ON a relay module, but the relay needs more current than the pin can provide. Correct solution:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Use EEPROM to increase current', isCorrect: false },
          { letter: 'B', text: 'Use a driver (transistor/relay module) controlled by MCU', isCorrect: true },
          { letter: 'C', text: 'Connect relay directly to the MCU pin', isCorrect: false },
          { letter: 'D', text: 'Remove the MCU and connect relay to battery only', isCorrect: false },
        ],
        answer: 'Use a driver (transistor/relay module) controlled by the MCU — this allows the MCU to control the relay without exceeding its current limit.',
      },
      {
        id: 215,
        text: 'Many sensors produce continuously varying voltage. To convert this to a number the CPU can process, the MCU uses:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'SPI', isCorrect: false },
          { letter: 'B', text: 'UART', isCorrect: false },
          { letter: 'C', text: 'ADC', isCorrect: true },
          { letter: 'D', text: 'PWM', isCorrect: false },
        ],
        answer: 'The ADC (Analog-to-Digital Converter) converts continuously varying analog voltage into digital numbers the CPU can process.',
      },
      {
        id: 216,
        text: '"Analog → Digital conversion" means:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Converting RAM into Flash', isCorrect: false },
          { letter: 'B', text: 'Converting a voltage level into a digital number', isCorrect: true },
          { letter: 'C', text: 'Converting 0/1 into a voltage wave', isCorrect: false },
          { letter: 'D', text: 'Converting code into music', isCorrect: false },
        ],
        answer: 'Analog → Digital conversion means converting a voltage level into a digital number that the CPU can process.',
      },
      {
        id: 217,
        text: 'A DAC is mainly needed when the MCU must:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Increase CPU clock speed automatically', isCorrect: false },
          { letter: 'B', text: 'Output a real analog voltage signal', isCorrect: true },
          { letter: 'C', text: 'Read a digital button', isCorrect: false },
          { letter: 'D', text: 'Store code permanently', isCorrect: false },
        ],
        answer: 'A DAC (Digital-to-Analog Converter) is needed when the MCU must output a real analog voltage signal.',
      },
      {
        id: 218,
        text: 'The most common programming language used in many microcontroller projects is:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'SQL', isCorrect: false },
          { letter: 'B', text: 'C / Embedded C', isCorrect: true },
          { letter: 'C', text: 'Photoshop', isCorrect: false },
          { letter: 'D', text: 'HTML', isCorrect: false },
        ],
        answer: 'C / Embedded C is the most common programming language used in microcontroller projects.',
      },
      {
        id: 219,
        text: 'Which list contains common microcontroller families?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'JPEG, PNG, MP3, MP4', isCorrect: false },
          { letter: 'B', text: 'AVR, PIC, 8051, ARM Cortex-M', isCorrect: true },
          { letter: 'C', text: 'HDMI, VGA, USB, RJ45', isCorrect: false },
          { letter: 'D', text: 'Excel, Word, PowerPoint, Outlook', isCorrect: false },
        ],
        answer: 'AVR, PIC, 8051, and ARM Cortex-M are common microcontroller families used in embedded systems.',
      },
      {
        id: 220,
        text: 'A key feature of a microcontroller compared to a microprocessor is that it typically:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Must run Windows', isCorrect: false },
          { letter: 'B', text: 'Has CPU + memory + I/O peripherals on the same chip', isCorrect: true },
          { letter: 'C', text: 'Requires external Flash and external I/O for basic operation', isCorrect: false },
          { letter: 'D', text: 'Cannot control sensors', isCorrect: false },
        ],
        answer: 'A key feature of a microcontroller is that it has CPU + memory + I/O peripherals integrated on the same chip.',
      },
      {
        id: 221,
        text: 'A key feature of a microprocessor-based system is that it often:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Only works with 8-bit data', isCorrect: false },
          { letter: 'B', text: 'Needs external memory (like DDR) and supports complex OS', isCorrect: true },
          { letter: 'C', text: 'Runs without any external RAM', isCorrect: false },
          { letter: 'D', text: 'Never uses caches', isCorrect: false },
        ],
        answer: 'A microprocessor-based system often needs external memory (like DDR) and supports running complex operating systems.',
      },
      {
        id: 222,
        text: 'A laptop CPU is best described as a:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'ADC', isCorrect: false },
          { letter: 'B', text: 'Sensor', isCorrect: false },
          { letter: 'C', text: 'Microprocessor', isCorrect: true },
          { letter: 'D', text: 'Microcontroller', isCorrect: false },
        ],
        answer: 'A laptop CPU is a microprocessor — it requires external memory and supports running a complex OS.',
      },
      {
        id: 223,
        text: 'Which use-case is most suitable for a microcontroller?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'High-end 3D gaming', isCorrect: false },
          { letter: 'B', text: 'Controlling an LED, reading a sensor, and driving a motor', isCorrect: true },
          { letter: 'C', text: 'Running heavy video editing software', isCorrect: false },
          { letter: 'D', text: 'Running multiple desktop applications', isCorrect: false },
        ],
        answer: 'Controlling an LED, reading a sensor, and driving a motor is most suitable for a microcontroller — dedicated control tasks.',
      },
      {
        id: 224,
        text: 'Which use-case is most suitable for a microprocessor?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Reading a single button', isCorrect: false },
          { letter: 'B', text: 'Running Linux with camera streaming and networking', isCorrect: true },
          { letter: 'C', text: 'Blinking an LED with low power', isCorrect: false },
          { letter: 'D', text: 'Simple ON/OFF relay control', isCorrect: false },
        ],
        answer: 'Running Linux with camera streaming and networking is most suitable for a microprocessor — it requires high performance and complex OS support.',
      },
      {
        id: 225,
        text: 'Caches (L1/L2/L3) in microprocessor systems are mainly used to:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Replace the need for a clock', isCorrect: false },
          { letter: 'B', text: 'Generate PWM signals', isCorrect: false },
          { letter: 'C', text: 'Speed up access to frequently used data/instructions', isCorrect: true },
          { letter: 'D', text: 'Convert analog to digital', isCorrect: false },
        ],
        answer: 'Caches (L1/L2/L3) speed up access to frequently used data and instructions in microprocessor systems.',
      },
      {
        id: 226,
        text: 'A feature that helps microprocessors run operating systems with memory protection and multitasking is:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'EEPROM', isCorrect: false },
          { letter: 'B', text: 'MMU (Memory Management Unit)', isCorrect: true },
          { letter: 'C', text: 'ADC channel', isCorrect: false },
          { letter: 'D', text: 'GPIO', isCorrect: false },
        ],
        answer: 'The MMU (Memory Management Unit) helps microprocessors run OS with memory protection and multitasking support.',
      },
      {
        id: 227,
        text: 'AVR is a microcontroller family originally associated with:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Microsoft only', isCorrect: false },
          { letter: 'B', text: 'Atmel (now part of Microchip)', isCorrect: true },
          { letter: 'C', text: 'Intel only', isCorrect: false },
          { letter: 'D', text: 'NVIDIA only', isCorrect: false },
        ],
        answer: 'AVR is a microcontroller family originally developed by Atmel, which is now part of Microchip Technology.',
      },
      {
        id: 228,
        text: 'Which set of features matches ATmega16 best?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Only Wi-Fi and Bluetooth with no CPU', isCorrect: false },
          { letter: 'B', text: '8-bit AVR, timers/PWM, ADC, EEPROM, UART/I2C/SPI', isCorrect: true },
          { letter: 'C', text: '64-bit CPU, DDR5 controller, GPU cores', isCorrect: false },
          { letter: 'D', text: 'Only RAM and SSD storage', isCorrect: false },
        ],
        answer: 'ATmega16 features: 8-bit AVR architecture, timers/PWM, ADC, EEPROM, and communication peripherals (UART/I2C/SPI).',
      },
      {
        id: 229,
        text: 'ATmega16 is described as Harvard architecture. The main idea is:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'No memory exists', isCorrect: false },
          { letter: 'B', text: 'Separate instruction/program path and data path (conceptually separated)', isCorrect: true },
          { letter: 'C', text: 'Only analog signals are used', isCorrect: false },
          { letter: 'D', text: 'One shared memory/path for everything', isCorrect: false },
        ],
        answer: 'Harvard architecture has separate instruction/program and data paths, allowing simultaneous access to both memories.',
      },
      {
        id: 230,
        text: '"MCUs are used in low-cost, low-power devices that do one control job, while microprocessors are for high-performance general computing." This statement is:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Only true for EEPROM', isCorrect: false },
          { letter: 'B', text: 'Incorrect', isCorrect: false },
          { letter: 'C', text: 'Correct', isCorrect: true },
          { letter: 'D', text: 'Only true for ADC', isCorrect: false },
        ],
        answer: 'This statement is correct — MCUs are for low-cost, low-power dedicated control tasks, while microprocessors are for high-performance general computing.',
      },
    ],
  },
  {
    id: 5,
    title: 'ATmega16 I/O Ports & Registers',
    marks: '30 pts',
    icon: '⚙️',
    questions: [
      {
        id: 301,
        text: 'A "PORT" in ATmega16 is best described as:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'A timer mode', isCorrect: false },
          { letter: 'B', text: 'A group of 8 pins', isCorrect: true },
          { letter: 'C', text: 'A memory type', isCorrect: false },
          { letter: 'D', text: 'One single pin only', isCorrect: false },
        ],
        answer: 'A PORT in ATmega16 is a group of 8 pins that can be controlled together through registers.',
      },
      {
        id: 302,
        text: 'In an 8-bit register, bit0 usually controls:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'pin0', isCorrect: true },
          { letter: 'B', text: 'pin7', isCorrect: false },
          { letter: 'C', text: 'ADC reference', isCorrect: false },
          { letter: 'D', text: 'the oscillator', isCorrect: false },
        ],
        answer: 'In an 8-bit register, bit0 usually controls pin0 — each bit corresponds to its respective pin number.',
      },
      {
        id: 303,
        text: 'Which value makes all bits = 1 for an 8-bit register?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: '0xF0', isCorrect: false },
          { letter: 'B', text: '0xFF', isCorrect: true },
          { letter: 'C', text: '0x00', isCorrect: false },
          { letter: 'D', text: '0x0F', isCorrect: false },
        ],
        answer: '0xFF (binary 11111111) makes all 8 bits = 1 in an 8-bit register.',
      },
      {
        id: 304,
        text: '0xAA in binary equals:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: '11110000', isCorrect: false },
          { letter: 'B', text: '10101010', isCorrect: true },
          { letter: 'C', text: '00001111', isCorrect: false },
          { letter: 'D', text: '11001100', isCorrect: false },
        ],
        answer: '0xAA in binary is 10101010 — each hex digit A = 1010 in binary.',
      },
      {
        id: 305,
        text: '0x0F in 8-bit binary is:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: '00001111', isCorrect: true },
          { letter: 'B', text: '11111111', isCorrect: false },
          { letter: 'C', text: '00011110', isCorrect: false },
          { letter: 'D', text: '11110000', isCorrect: false },
        ],
        answer: '0x0F in 8-bit binary is 00001111 — the upper nibble is 0, the lower nibble is F (1111).',
      },
      {
        id: 306,
        text: 'A floating input is dangerous because it:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'burns the MCU', isCorrect: false },
          { letter: 'B', text: 'always reads 1', isCorrect: false },
          { letter: 'C', text: 'may randomly read 0 or 1', isCorrect: true },
          { letter: 'D', text: 'always reads 0', isCorrect: false },
        ],
        answer: 'A floating input is dangerous because it may randomly read 0 or 1, causing unpredictable behavior in the program.',
      },
      {
        id: 307,
        text: 'The main role of a pull-up resistor is to:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'enable ADC', isCorrect: false },
          { letter: 'B', text: 'increase CPU speed', isCorrect: false },
          { letter: 'C', text: 'make input stable HIGH when not driven', isCorrect: true },
          { letter: 'D', text: 'make input always LOW', isCorrect: false },
        ],
        answer: 'A pull-up resistor makes the input stable HIGH when not actively driven, preventing floating states.',
      },
      {
        id: 308,
        text: 'In ATmega16, the register that controls direction of pins is:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'PORTx', isCorrect: false },
          { letter: 'B', text: 'DDRx', isCorrect: true },
          { letter: 'C', text: 'PINx', isCorrect: false },
          { letter: 'D', text: 'EEPROM', isCorrect: false },
        ],
        answer: 'DDRx (Data Direction Register) controls the direction of pins — 0 for input, 1 for output.',
      },
      {
        id: 309,
        text: 'DDRx bit = 0 means the pin is:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'UART mode', isCorrect: false },
          { letter: 'B', text: 'output', isCorrect: false },
          { letter: 'C', text: 'input', isCorrect: true },
          { letter: 'D', text: 'pull-up enabled', isCorrect: false },
        ],
        answer: 'DDRx bit = 0 configures the pin as an input.',
      },
      {
        id: 310,
        text: 'DDRx bit = 1 means the pin is:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'pull-up enabled', isCorrect: false },
          { letter: 'B', text: 'floating', isCorrect: false },
          { letter: 'C', text: 'output', isCorrect: true },
          { letter: 'D', text: 'input', isCorrect: false },
        ],
        answer: 'DDRx bit = 1 configures the pin as an output.',
      },
      {
        id: 311,
        text: 'If DDRA = 0x00, then Port A pins are:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'all LOW', isCorrect: false },
          { letter: 'B', text: 'all outputs', isCorrect: false },
          { letter: 'C', text: 'all inputs', isCorrect: true },
          { letter: 'D', text: 'all HIGH', isCorrect: false },
        ],
        answer: 'DDRA = 0x00 means all bits are 0, so all Port A pins are configured as inputs.',
      },
      {
        id: 312,
        text: 'If DDRB = 0xFF, then Port B pins are:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'floating', isCorrect: false },
          { letter: 'B', text: 'all outputs', isCorrect: true },
          { letter: 'C', text: 'ADC inputs only', isCorrect: false },
          { letter: 'D', text: 'all inputs', isCorrect: false },
        ],
        answer: 'DDRB = 0xFF means all bits are 1, so all Port B pins are configured as outputs.',
      },
      {
        id: 313,
        text: 'DDRB = 0b00001111 means:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'PB0..PB3 outputs, PB4..PB7 inputs', isCorrect: true },
          { letter: 'B', text: 'all inputs', isCorrect: false },
          { letter: 'C', text: 'PB0..PB3 inputs, PB4..PB7 outputs', isCorrect: false },
          { letter: 'D', text: 'all outputs', isCorrect: false },
        ],
        answer: 'DDRB = 0b00001111 means bits 0-3 are 1 (outputs) and bits 4-7 are 0 (inputs): PB0..PB3 are outputs, PB4..PB7 are inputs.',
      },
      {
        id: 314,
        text: 'PORTx has two meanings depending on DDRx. This statement is:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Only for ADC pins', isCorrect: false },
          { letter: 'B', text: 'False', isCorrect: false },
          { letter: 'C', text: 'Only for Port A', isCorrect: false },
          { letter: 'D', text: 'True', isCorrect: true },
        ],
        answer: 'This is true — when a pin is output (DDRx=1), PORTx sets the output value; when a pin is input (DDRx=0), PORTx controls the pull-up resistor.',
      },
      {
        id: 315,
        text: 'If a pin is OUTPUT (DDRx=1), writing PORTx bit = 1 makes the pin:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'input', isCorrect: false },
          { letter: 'B', text: 'LOW', isCorrect: false },
          { letter: 'C', text: 'floating', isCorrect: false },
          { letter: 'D', text: 'HIGH', isCorrect: true },
        ],
        answer: 'When a pin is configured as output (DDRx=1), writing PORTx bit = 1 drives the pin HIGH.',
      },
      {
        id: 316,
        text: 'If a pin is OUTPUT (DDRx=1), writing PORTx bit = 0 makes the pin:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'pull-up ON', isCorrect: false },
          { letter: 'B', text: 'HIGH', isCorrect: false },
          { letter: 'C', text: 'LOW', isCorrect: true },
          { letter: 'D', text: 'input', isCorrect: false },
        ],
        answer: 'When a pin is configured as output (DDRx=1), writing PORTx bit = 0 drives the pin LOW.',
      },
      {
        id: 317,
        text: 'If a pin is INPUT (DDRx=0), writing PORTx bit = 1 means:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'pull-up enabled', isCorrect: true },
          { letter: 'B', text: 'output HIGH', isCorrect: false },
          { letter: 'C', text: 'pull-up disabled', isCorrect: false },
          { letter: 'D', text: 'ADC enabled', isCorrect: false },
        ],
        answer: 'When a pin is configured as input (DDRx=0), writing PORTx bit = 1 enables the internal pull-up resistor.',
      },
      {
        id: 318,
        text: 'If a pin is INPUT (DDRx=0), writing PORTx bit = 0 means:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'output HIGH', isCorrect: false },
          { letter: 'B', text: 'pull-up enabled', isCorrect: false },
          { letter: 'C', text: 'output LOW', isCorrect: false },
          { letter: 'D', text: 'pull-up disabled (may float)', isCorrect: true },
        ],
        answer: 'When a pin is configured as input (DDRx=0), writing PORTx bit = 0 disables the pull-up resistor, leaving the pin floating.',
      },
      {
        id: 319,
        text: 'The register used to read the actual pin state is:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'PORTx', isCorrect: false },
          { letter: 'B', text: 'DDRx', isCorrect: false },
          { letter: 'C', text: 'PINx', isCorrect: true },
          { letter: 'D', text: 'TCCR0', isCorrect: false },
        ],
        answer: 'PINx is the register used to read the actual logic level on the physical pin.',
      },
      {
        id: 320,
        text: 'Correct typical sequence to read a button with pull-up:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'DDR=0 → PORT=0 → read PORT', isCorrect: false },
          { letter: 'B', text: 'DDR=1 → PORT=1 → read PIN', isCorrect: false },
          { letter: 'C', text: 'DDR=0 → PORT=1 → read PIN', isCorrect: true },
          { letter: 'D', text: 'DDR=1 → PORT=0 → read DDR', isCorrect: false },
        ],
        answer: 'The correct sequence is: DDR=0 (input) → PORT=1 (enable pull-up) → read PIN (read actual pin state).',
      },
      {
        id: 321,
        text: 'If DDRB=0x00 and PORTB=0x00, Port B pins are:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'inputs pull-up enabled', isCorrect: false },
          { letter: 'B', text: 'outputs HIGH', isCorrect: false },
          { letter: 'C', text: 'inputs floating', isCorrect: true },
          { letter: 'D', text: 'outputs LOW', isCorrect: false },
        ],
        answer: 'DDRB=0x00 means all inputs, and PORTB=0x00 means pull-ups disabled, so all Port B pins are floating inputs.',
      },
      {
        id: 322,
        text: 'If DDRB=0x00 and PORTB=0xFF, Port B pins are:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'floating', isCorrect: false },
          { letter: 'B', text: 'outputs HIGH', isCorrect: false },
          { letter: 'C', text: 'inputs with pull-ups enabled', isCorrect: true },
          { letter: 'D', text: 'outputs LOW', isCorrect: false },
        ],
        answer: 'DDRB=0x00 means all inputs, and PORTB=0xFF enables pull-ups on all pins, so Port B pins are inputs with pull-ups enabled.',
      },
      {
        id: 323,
        text: 'If DDRC=0xFF and PORTC=0x11, which pins are HIGH?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'PC7 and PC4', isCorrect: false },
          { letter: 'B', text: 'PC0 and PC4', isCorrect: true },
          { letter: 'C', text: 'PC1 and PC0', isCorrect: false },
          { letter: 'D', text: 'all pins', isCorrect: false },
        ],
        answer: '0x11 in binary is 00010001 — bit0 (PC0) and bit4 (PC4) are 1, so PC0 and PC4 are HIGH.',
      },
      {
        id: 324,
        text: 'Which code sets PA0 as input?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'PORTA |= (1<<0);', isCorrect: false },
          { letter: 'B', text: 'DDRA &= ~(1<<0);', isCorrect: true },
          { letter: 'C', text: 'DDRA |= (1<<0);', isCorrect: false },
          { letter: 'D', text: 'PINA |= (1<<0);', isCorrect: false },
        ],
        answer: 'DDRA &= ~(1<<0) clears bit0 of DDRA, setting PA0 as input (DDRx bit = 0 means input).',
      },
      {
        id: 325,
        text: 'Which code enables pull-up on PA0 (PA0 is input)?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'PINA |= (1<<0);', isCorrect: false },
          { letter: 'B', text: 'DDRA |= (1<<0);', isCorrect: false },
          { letter: 'C', text: 'PORTA |= (1<<0);', isCorrect: true },
          { letter: 'D', text: 'PORTA &= ~(1<<0);', isCorrect: false },
        ],
        answer: 'PORTA |= (1<<0) sets bit0 of PORTA, which enables the pull-up resistor when PA0 is configured as input.',
      },
      {
        id: 326,
        text: 'Which expression correctly reads only bit0 from PINA as 0/1?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'b = DDRA & 1;', isCorrect: false },
          { letter: 'B', text: 'b = (PINA>>0) & 1;', isCorrect: true },
          { letter: 'C', text: 'b = PINA;', isCorrect: false },
          { letter: 'D', text: 'b = PORTA & 1;', isCorrect: false },
        ],
        answer: '(PINA>>0) & 1 reads bit0 from PINA — it shifts right by 0 and masks with 1 to get only the least significant bit.',
      },
      {
        id: 327,
        text: 'Setting only PC4 as output is best done by:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'DDRC = 0x00;', isCorrect: false },
          { letter: 'B', text: 'DDRC |= (1<<4);', isCorrect: true },
          { letter: 'C', text: 'PORTC |= (1<<4);', isCorrect: false },
          { letter: 'D', text: 'DDRC = 0xFF;', isCorrect: false },
        ],
        answer: 'DDRC |= (1<<4) sets only bit4 of DDRC to 1, making PC4 an output without affecting other pins.',
      },
      {
        id: 328,
        text: 'Making PC4 HIGH (after it is output) is done by:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'DDRC &= ~(1<<4);', isCorrect: false },
          { letter: 'B', text: 'PORTC |= (1<<4);', isCorrect: true },
          { letter: 'C', text: 'PINC = (1<<4);', isCorrect: false },
          { letter: 'D', text: 'PINC |= (1<<4);', isCorrect: false },
        ],
        answer: 'PORTC |= (1<<4) sets bit4 of PORTC to 1, driving PC4 HIGH when it is configured as output.',
      },
      {
        id: 329,
        text: 'When you want to change one pin only without affecting others, you should use:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'only binary values', isCorrect: false },
          { letter: 'B', text: 'bit operations (set/clear with masks)', isCorrect: true },
          { letter: 'C', text: 'direct assignment PORTx = value always', isCorrect: false },
          { letter: 'D', text: 'only hex values', isCorrect: false },
        ],
        answer: 'Bit operations (set with |= and clear with &= ~) using masks allow changing one pin without affecting others.',
      },
      {
        id: 330,
        text: 'Which statement is correct?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Read inputs from DDRx', isCorrect: false },
          { letter: 'B', text: 'Read inputs from EEPROM', isCorrect: false },
          { letter: 'C', text: 'Read inputs from PORTx', isCorrect: false },
          { letter: 'D', text: 'Read inputs from PINx', isCorrect: true },
        ],
        answer: 'Read inputs from PINx — PINx reflects the actual logic level on the physical pins, while PORTx and DDRx are for output and direction control.',
      },
    ],
  },
]

// ─── State Types ─────────────────────────────────────
interface QuestionState {
  userCode: string
  fillAnswers: Record<number, string>
  selectedMcq: string | null
  isChecked: boolean
  isSolutionRevealed: boolean
  isCorrect: boolean | null
  fillCorrect: Record<number, boolean>
}

// ─── LocalStorage Key ────────────────────────────────
const STORAGE_KEY = 'prepify-iot-progress'

// ─── Main Component ──────────────────────────────────
export default function Home() {
  const {
    quizStarted, userName, timerMinutes, showStartPopup, elapsedSeconds,
    attemptSubmitting, attemptSubmitted,
    handleStartQuiz, handleSkipPopup, submitQuizAttempt, setShowStartPopup,
  } = useQuizTracking('iot', 'iot-full')

  const [questionStates, setQuestionStates] = useState<Record<number, QuestionState>>({})
  const [activeSection, setActiveSection] = useState<number | null>(null)
  const [scoreSubmitted, setScoreSubmitted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)
  const sectionNavRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragScrollLeft, setDragScrollLeft] = useState(0)
  const [showLeftFade, setShowLeftFade] = useState(false)
  const [showRightFade, setShowRightFade] = useState(true)

  // ─── Drag-to-scroll for section nav ───────────────────
  const updateFadeIndicators = useCallback(() => {
    const el = sectionNavRef.current
    if (!el) return
    setShowLeftFade(el.scrollLeft > 5)
    setShowRightFade(el.scrollLeft < el.scrollWidth - el.clientWidth - 5)
  }, [])

  useEffect(() => {
    updateFadeIndicators()
    const el = sectionNavRef.current
    if (!el) return
    el.addEventListener('scroll', updateFadeIndicators)
    window.addEventListener('resize', updateFadeIndicators)
    return () => {
      el.removeEventListener('scroll', updateFadeIndicators)
      window.removeEventListener('resize', updateFadeIndicators)
    }
  }, [updateFadeIndicators])

  const handleDragStart = useCallback((clientX: number) => {
    const el = sectionNavRef.current
    if (!el) return
    setIsDragging(true)
    setDragStartX(clientX)
    setDragScrollLeft(el.scrollLeft)
  }, [])

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging) return
    const el = sectionNavRef.current
    if (!el) return
    const walk = (clientX - dragStartX) * 1.5
    el.scrollLeft = dragScrollLeft - walk
  }, [isDragging, dragStartX, dragScrollLeft])

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // ─── Load saved progress from localStorage on mount ───
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        if (data.questionStates) setQuestionStates(data.questionStates)
        if (data.scoreSubmitted) setScoreSubmitted(data.scoreSubmitted)
      }
    } catch { /* ignore parse errors */ }
    setHydrated(true)
  }, [])

  // ─── Save progress to localStorage on state change ───
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ questionStates, scoreSubmitted }))
    } catch { /* ignore quota errors */ }
  }, [questionStates, scoreSubmitted, hydrated])

  const totalQuestions = sections.reduce((acc, s) => acc + s.questions.length, 0)

  const getQState = useCallback((qId: number): QuestionState => {
    return questionStates[qId] || {
      userCode: '',
      fillAnswers: {},
      selectedMcq: null,
      isChecked: false,
      isSolutionRevealed: false,
      isCorrect: null,
      fillCorrect: {},
    }
  }, [questionStates])

  const updateQState = useCallback((qId: number, update: Partial<QuestionState>) => {
    setQuestionStates(prev => ({
      ...prev,
      [qId]: { ...getQState(qId), ...update },
    }))
  }, [getQState])

  const answeredCount = Object.values(questionStates).filter(
    s => s.isChecked || s.isSolutionRevealed || s.selectedMcq !== null || s.userCode.trim().length > 0 || Object.keys(s.fillAnswers).length > 0
  ).length

  const correctCount = Object.values(questionStates).filter(
    s => s.isChecked && s.isCorrect === true
  ).length

  // MCQ/TF check
  const checkMcq = useCallback((qId: number, question: Question) => {
    const state = getQState(qId)
    if (!state.selectedMcq) return
    const correct = question.mcqOptions?.find(o => o.letter === state.selectedMcq)?.isCorrect ?? false
    updateQState(qId, { isChecked: true, isCorrect: correct })
  }, [getQState, updateQState])

  // Fill check
  const checkFill = useCallback((qId: number, question: Question) => {
    const state = getQState(qId)
    const fillCorrect: Record<number, boolean> = {}
    let allCorrect = true
    question.fillItems?.forEach((item, idx) => {
      const userAns = (state.fillAnswers[idx] || '').trim().toLowerCase()
      const correctAns = item.answer.trim().toLowerCase()
      const isCorrect = userAns === correctAns
      fillCorrect[idx] = isCorrect
      if (!isCorrect) allCorrect = false
    })
    updateQState(qId, { isChecked: true, isCorrect: allCorrect, fillCorrect })
  }, [getQState, updateQState])

  // Code/trace check
  const checkCode = useCallback((qId: number) => {
    const state = getQState(qId)
    const hasContent = state.userCode.trim().length > 0
    updateQState(qId, { isChecked: true, isCorrect: hasContent ? null : false })
  }, [getQState, updateQState])

  // Reveal solution
  const revealSolution = useCallback((qId: number) => {
    updateQState(qId, { isSolutionRevealed: true })
  }, [updateQState])

  // Hide solution
  const hideSolution = useCallback((qId: number) => {
    updateQState(qId, { isSolutionRevealed: false })
  }, [updateQState])

  // Reset question
  const resetQuestion = useCallback((qId: number) => {
    setQuestionStates(prev => {
      const next = { ...prev }
      delete next[qId]
      return next
    })
  }, [])

  // Reveal all solutions
  const revealAllSolutions = useCallback(() => {
    sections.forEach(s => s.questions.forEach(q => {
      updateQState(q.id, { isSolutionRevealed: true })
    }))
  }, [updateQState])

  // Hide all solutions
  const hideAllSolutions = useCallback(() => {
    sections.forEach(s => s.questions.forEach(q => {
      updateQState(q.id, { isSolutionRevealed: false })
    }))
  }, [updateQState])

  // Reset all
  const resetAll = useCallback(() => {
    setQuestionStates({})
    setScoreSubmitted(false)
    setShowConfetti(false)
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
  }, [])

  // Submit all & show score
  const submitAll = useCallback(() => {
    setScoreSubmitted(true)
    if (correctCount / totalQuestions >= 0.8) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 4000)
    }
    // Save attempt to database
    const wrongCount = answeredCount - correctCount
    submitQuizAttempt(correctCount, wrongCount, totalQuestions)
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [correctCount, totalQuestions, answeredCount, submitQuizAttempt])

  useEffect(() => {
    const handleScroll = () => {
      const sectionHeaders = document.querySelectorAll('[data-section-id]')
      let current: number | null = null
      sectionHeaders.forEach(header => {
        const rect = header.getBoundingClientRect()
        if (rect.top <= 150) {
          current = Number(header.getAttribute('data-section-id'))
        }
      })
      if (current !== null) setActiveSection(current)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate total marks
  const totalMarks = sections.reduce((acc, s) => {
    return acc + s.questions.reduce((qAcc, q) => {
      const m = parseInt(q.marks)
      return qAcc + (isNaN(m) ? 0 : m)
    }, 0)
  }, 0)

  return (
    <div className="min-h-screen bg-[#080c18] text-[#e2e8f0] font-sans">
      {/* Quiz Start Popup */}
      <QuizStartPopup
        open={showStartPopup}
        onClose={handleSkipPopup}
        onStart={handleStartQuiz}
        subjectName="Internet of Things (IoT)"
      />

      {/* Timer */}
      {quizStarted && timerMinutes > 0 && (
        <QuizTimer
          minutes={timerMinutes}
          onTimeUp={() => {
            if (!scoreSubmitted) {
              submitAll()
            }
          }}
        />
      )}

      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #00d4ff, transparent 70%)' }} />
      </div>

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  background: ['#7c3aed', '#00d4ff', '#10b981', '#f59e0b', '#ef4444', '#ec4899'][i % 6],
                }}
                animate={{
                  y: [0, window.innerHeight + 100],
                  x: [0, (Math.random() - 0.5) * 200],
                  rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
                }}
                transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 1, ease: 'easeIn' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-1 max-w-[920px] mx-auto px-4 pb-10" ref={topRef}>
        {/* Back to Home */}
        <div className="pt-4">
          <a href="/" className="inline-flex items-center gap-2 text-[#64748b] hover:text-[#00d4ff] text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Home
          </a>
        </div>

        {/* Header */}
        <motion.header
          className="text-center pt-10 pb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Prepify Logo" className="w-24 h-24 md:w-28 md:h-28 rounded-2xl shadow-[0_0_30px_rgba(124,58,237,0.3)]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-2">
            <span className="bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] bg-clip-text text-transparent">Internet of Things (IoT)</span>
            <br />
            <span className="text-[#10b981]">Interactive Review</span>
          </h1>
          <p className="text-[#64748b] text-[15px] mb-6">
            Mahmoud ABD ELKream &nbsp;|&nbsp; Spring 2025/2026
          </p>
          <div className="flex justify-center gap-6 flex-wrap mt-4">
            <div className="text-center bg-[#111827] border border-[#1e2d45] rounded-2xl px-6 py-3 min-w-[90px]">
              <div className="text-2xl font-black text-[#00d4ff]">{totalQuestions}</div>
              <div className="text-[11px] text-[#64748b]">Questions</div>
            </div>
            <div className="text-center bg-[#111827] border border-[#1e2d45] rounded-2xl px-6 py-3 min-w-[90px]">
              <div className="text-2xl font-black text-[#10b981]">{totalMarks}</div>
              <div className="text-[11px] text-[#64748b]">Marks</div>
            </div>
            <div className="text-center bg-[#111827] border border-[#1e2d45] rounded-2xl px-6 py-3 min-w-[90px]">
              <div className="text-2xl font-black text-[#7c3aed]">5</div>
              <div className="text-[11px] text-[#64748b]">Sections</div>
            </div>
            <div className="text-center bg-[#111827] border border-[#1e2d45] rounded-2xl px-6 py-3 min-w-[90px]">
              <div className="text-2xl font-black text-[#f59e0b]">{correctCount}</div>
              <div className="text-[11px] text-[#64748b]">Correct</div>
            </div>
          </div>
        </motion.header>

        {/* Sticky Controls Bar */}
        <div className="bg-[#111827]/90 border border-[#1e2d45] rounded-2xl p-3 mb-6 sticky top-2.5 z-50 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] text-[#64748b]">Progress</span>
                <span className="text-[11px] text-[#00d4ff] font-bold">{Math.round((answeredCount / totalQuestions) * 100)}%</span>
              </div>
              <div className="h-2 bg-[#1e2d45] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] rounded-full"
                  animate={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
            <div className="text-xs text-[#64748b] whitespace-nowrap">
              {answeredCount} / {totalQuestions}
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              <button
                onClick={revealAllSolutions}
                className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white border-none rounded-lg px-4 py-1.5 font-bold text-xs cursor-pointer hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                Show All Solutions
              </button>
              <button
                onClick={hideAllSolutions}
                className="bg-transparent text-[#64748b] border border-[#1e2d45] rounded-lg px-3 py-1.5 text-xs cursor-pointer hover:border-[#64748b] transition-colors"
              >
                Hide All
              </button>
              <button
                onClick={resetAll}
                className="bg-transparent text-[#ef4444] border border-[#ef4444]/30 rounded-lg px-3 py-1.5 text-xs cursor-pointer hover:bg-[#ef4444]/10 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Section nav pills - draggable with fade indicators */}
          <div className="relative mt-3">
            {/* Left fade indicator */}
            <div className={`absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-300 ${showLeftFade ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'linear-gradient(to right, #0f172a, transparent)' }} />
            {/* Right fade indicator */}
            <div className={`absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-300 ${showRightFade ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'linear-gradient(to left, #0f172a, transparent)' }} />
            <div
              ref={sectionNavRef}
              className={`flex gap-2 overflow-x-auto pb-1 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onMouseDown={(e) => { e.preventDefault(); handleDragStart(e.clientX) }}
              onMouseMove={(e) => handleDragMove(e.clientX)}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
              onTouchEnd={handleDragEnd}
            >
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    if (!isDragging) {
                      document.querySelector(`[data-section-id="${s.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    activeSection === s.id
                      ? 'bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] text-white border-transparent shadow-[0_0_10px_rgba(0,212,255,0.3)]'
                      : 'bg-[#1a2235] text-[#64748b] border-[#1e2d45] hover:border-[#00d4ff]/50 hover:text-[#00d4ff]'
                  }`}
                >
                  <span>{s.icon}</span>
                  Section {s.id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sections */}
        {sections.map((section, sIdx) => (
          <motion.div
            key={section.id}
            data-section-id={section.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: sIdx * 0.1 }}
          >
            {/* Section header */}
            <div className="flex items-center gap-4 mt-10 mb-6 pb-4 border-b-2 border-[#1e2d45] relative">
              <div className="w-[48px] h-[48px] bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] rounded-[14px] flex items-center justify-center text-2xl shrink-0 shadow-[0_0_20px_rgba(0,212,255,0.2)]">
                {section.icon}
              </div>
              <div className="flex-1">
                <div className="text-lg font-black">{section.title}</div>
                <div className="text-xs text-[#64748b]">Section {section.id} of 5</div>
              </div>
              <div className="bg-[#1a2235] border border-[#1e2d45] px-4 py-2 rounded-full text-sm font-bold text-[#00d4ff] shadow-[0_0_10px_rgba(0,212,255,0.1)]">
                {section.marks}
              </div>
            </div>

            {/* Questions */}
            {section.questions.map((q, qIdx) => (
              <QuestionCard
                key={q.id}
                question={q}
                state={getQState(q.id)}
                onUpdate={updateQState}
                onCheckMcq={() => checkMcq(q.id, q)}
                onCheckFill={() => checkFill(q.id, q)}
                onCheckCode={() => checkCode(q.id)}
                onRevealSolution={() => revealSolution(q.id)}
                onHideSolution={() => hideSolution(q.id)}
                onReset={() => resetQuestion(q.id)}
                index={qIdx}
              />
            ))}
          </motion.div>
        ))}

        {/* Submit Section */}
        {!scoreSubmitted ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={submitAll}
              className="bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] text-white border-none rounded-2xl px-12 py-4 font-black text-xl cursor-pointer transition-all shadow-[0_0_40px_rgba(0,212,255,0.3)] hover:shadow-[0_0_60px_rgba(0,212,255,0.5)] hover:-translate-y-1 active:translate-y-0"
            >
              Show Final Score
            </button>
            <p className="text-[#64748b] text-sm mt-3">Make sure to review your answers before showing the score</p>
          </motion.div>
        ) : (
          <ScorePanel
            correctCount={correctCount}
            totalQuestions={totalQuestions}
            answeredCount={answeredCount}
            onReset={resetAll}
            onRevealAll={revealAllSolutions}
            timeTaken={elapsedSeconds}
          />
        )}

        {/* Footer */}
        <footer className="text-center py-8 border-t border-[#1e2d45] mt-8">
          <div className="mb-3">
            <span className="text-[#e2e8f0] font-bold text-lg">Mahmoud ABD ELKream</span>
          </div>
          <div className="flex justify-center gap-4 mb-4">
            <a href="https://github.com/Mahmoud-ABDALKream" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111827] border border-[#1e2d45] text-[#e2e8f0] text-sm hover:border-[#7c3aed] hover:shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-all duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </a>
            <a href="https://mahmoud-ahmed-abdelkream.vercel.app/" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111827] border border-[#1e2d45] text-[#e2e8f0] text-sm hover:border-[#00d4ff] hover:shadow-[0_0_15px_rgba(0,212,255,0.2)] transition-all duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L1.5 20h6l4.5-8.5L16.5 20h6L12 0zm0 7.5L8.25 14.5h7.5L12 7.5z"/></svg>
              Portfolio
            </a>
            <a href="https://www.linkedin.com/in/mahmoud-ahmed-abdelkream/" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111827] border border-[#1e2d45] text-[#e2e8f0] text-sm hover:border-[#0077b5] hover:shadow-[0_0_15px_rgba(0,119,181,0.2)] transition-all duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
          </div>
          <div className="text-[#64748b] text-sm">
            IoT Quiz — <span className="text-[#00d4ff]">Mahmoud ABD ELKream</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

// ─── Score Panel ──────────────────────────────────────
function ScorePanel({
  correctCount,
  totalQuestions,
  answeredCount,
  onReset,
  onRevealAll,
  timeTaken,
}: {
  correctCount: number
  totalQuestions: number
  answeredCount: number
  onReset: () => void
  onRevealAll: () => void
  timeTaken?: number
}) {
  const pct = Math.round((correctCount / totalQuestions) * 100)
  const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : pct >= 50 ? 'D' : 'F'
  const gradeColor = pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444'

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`
    if (m > 0) return `${m}m ${String(s).padStart(2, '0')}s`
    return `${s}s`
  }

  return (
    <motion.div
      className="bg-[#111827] border border-[#1e2d45] rounded-3xl p-8 mt-8 text-center shadow-[0_0_40px_rgba(0,0,0,0.3)]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      <h2 className="text-2xl font-black mb-2">Your Score</h2>
      <p className="text-[#64748b] text-sm mb-6">Total verified answers</p>

      {/* Score Circle */}
      <div className="relative w-[160px] h-[160px] mx-auto mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="70" fill="none" stroke="#1e2d45" strokeWidth="10" />
          <motion.circle
            cx="80" cy="80" r="70" fill="none"
            stroke="url(#scoreGrad)" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={440}
            initial={{ strokeDashoffset: 440 }}
            animate={{ strokeDashoffset: 440 - (440 * pct / 100) }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#00d4ff" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            className="text-4xl font-black bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] bg-clip-text text-transparent"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            {pct}%
          </motion.div>
          <div className="text-xs text-[#64748b]">Score</div>
        </div>
      </div>

      {/* Grade */}
      <motion.div
        className="inline-block text-5xl font-black px-8 py-2 rounded-2xl mb-6"
        style={{ color: gradeColor, background: `${gradeColor}15`, border: `2px solid ${gradeColor}40` }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: 'spring' }}
      >
        {grade}
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <div className="bg-[#1a2235] border border-[#1e2d45] rounded-xl p-4">
          <div className="text-xl font-black text-[#10b981]">{correctCount}</div>
          <div className="text-[11px] text-[#64748b]">Correct</div>
        </div>
        <div className="bg-[#1a2235] border border-[#1e2d45] rounded-xl p-4">
          <div className="text-xl font-black text-[#ef4444]">{answeredCount - correctCount}</div>
          <div className="text-[11px] text-[#64748b]">Wrong</div>
        </div>
        <div className="bg-[#1a2235] border border-[#1e2d45] rounded-xl p-4">
          <div className="text-xl font-black text-[#00d4ff]">{totalQuestions - answeredCount}</div>
          <div className="text-[11px] text-[#64748b]">Unanswered</div>
        </div>
        <div className="bg-[#1a2235] border border-[#1e2d45] rounded-xl p-4">
          <div className="text-xl font-black text-[#7c3aed]">{totalQuestions}</div>
          <div className="text-[11px] text-[#64748b]">Total</div>
        </div>
        {timeTaken != null && timeTaken > 0 && (
          <div className="bg-[#1a2235] border border-[#1e2d45] rounded-xl p-4">
            <div className="text-xl font-black text-[#8b5cf6]">{formatTime(timeTaken)}</div>
            <div className="text-[11px] text-[#64748b]">Time Taken</div>
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={onRevealAll}
          className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white border-none rounded-xl px-6 py-3 font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        >
          Show All Solutions
        </button>
        <button
          onClick={onReset}
          className="bg-transparent text-[#64748b] border-2 border-[#1e2d45] rounded-xl px-6 py-3 font-bold text-sm cursor-pointer hover:border-[#00d4ff] hover:text-[#00d4ff] transition-all"
        >
          Try Again
        </button>
      </div>
    </motion.div>
  )
}

// ─── Question Card ────────────────────────────────────
function QuestionCard({
  question,
  state,
  onUpdate,
  onCheckMcq,
  onCheckFill,
  onCheckCode,
  onRevealSolution,
  onHideSolution,
  onReset,
  index,
}: {
  question: Question
  state: QuestionState
  onUpdate: (qId: number, update: Partial<QuestionState>) => void
  onCheckMcq: () => void
  onCheckFill: () => void
  onCheckCode: () => void
  onRevealSolution: () => void
  onHideSolution: () => void
  onReset: () => void
  index: number
}) {
  const isMcqOrTf = question.type === 'mcq' || question.type === 'tf'

  const statusColor = state.isChecked
    ? state.isCorrect === true
      ? '#10b981'
      : state.isCorrect === false
      ? '#ef4444'
      : '#f59e0b'
    : state.isSolutionRevealed
    ? '#00d4ff'
    : '#1e2d45'

  const statusBg = state.isChecked
    ? state.isCorrect === true
      ? 'rgba(16,185,129,0.05)'
      : state.isCorrect === false
      ? 'rgba(239,68,68,0.05)'
      : 'rgba(245,158,11,0.05)'
    : 'transparent'

  return (
    <motion.div
      className="bg-[#111827] rounded-2xl mb-5 overflow-hidden transition-all duration-300"
      style={{ border: `1.5px solid ${statusColor}`, boxShadow: state.isChecked ? `0 0 20px ${statusColor}15` : 'none' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      {/* Header */}
      <div className="flex items-start gap-3.5 p-5 pb-3" style={{ background: statusBg }}>
        <div className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center font-mono text-sm font-bold shrink-0 transition-colors ${
          state.isChecked && state.isCorrect === true
            ? 'bg-[#10b981] text-white'
            : state.isChecked && state.isCorrect === false
            ? 'bg-[#ef4444] text-white'
            : state.isChecked
            ? 'bg-[#f59e0b] text-white'
            : state.isSolutionRevealed
            ? 'bg-[#00d4ff] text-white'
            : 'bg-[#1a2235] border border-[#1e2d45] text-[#00d4ff]'
        }`}>
          {state.isChecked && state.isCorrect === true ? '✓' :
           state.isChecked && state.isCorrect === false ? '✗' :
           state.isChecked ? '∼' :
           String(question.id).padStart(2, '0')}
        </div>
        <div className="text-[15px] leading-relaxed flex-1 font-medium">
          {question.text}
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <div className="text-[11px] text-[#64748b] bg-[#1a2235] px-2.5 py-1 rounded-lg whitespace-nowrap border border-[#1e2d45]">
            {question.marks}
          </div>
          <div className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
            question.type === 'mcq' ? 'bg-[#7c3aed]/20 text-[#a78bfa]' :
            question.type === 'tf' ? 'bg-[#ec4899]/20 text-[#f472b6]' :
            question.type === 'trace' ? 'bg-[#f59e0b]/20 text-[#fbbf24]' :
            question.type === 'fill' ? 'bg-[#00d4ff]/20 text-[#22d3ee]' :
            'bg-[#10b981]/20 text-[#34d399]'
          }`}>
            {question.type === 'mcq' ? 'MCQ' :
             question.type === 'tf' ? 'T/F' :
             question.type === 'trace' ? 'Trace' :
             question.type === 'fill' ? 'Fill' : 'Code'}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        {/* Hint */}
        {question.hint && !state.isChecked && !state.isSolutionRevealed && (
          <div className="inline-flex items-center gap-1.5 bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.25)] text-[#f59e0b] text-xs px-3 py-1.5 rounded-lg mb-3">
            <span>💡</span>
            {question.hint}
          </div>
        )}

        {/* Code block (question) */}
        {question.codeBlock && (
          <pre className="bg-[#0a0f1e] border border-[#1e2d45] rounded-xl p-4 my-3 font-mono text-[13px] leading-relaxed text-left whitespace-pre-wrap overflow-x-auto text-[#a5b4fc] shadow-[inset_0_0_30px_rgba(0,0,0,0.3)]" dir="ltr">
            {question.codeBlock}
          </pre>
        )}

        {/* ── MCQ/TF Options ── */}
        {isMcqOrTf && question.mcqOptions && (
          <div className={`grid gap-2.5 mt-3 ${question.type === 'tf' ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {question.mcqOptions.map(opt => {
              const isSelected = state.selectedMcq === opt.letter
              const showResult = state.isChecked || state.isSolutionRevealed

              return (
                <button
                  key={opt.letter}
                  onClick={() => {
                    if (!state.isChecked) {
                      onUpdate(question.id, { selectedMcq: opt.letter })
                    }
                  }}
                  disabled={state.isChecked}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 border text-sm text-left transition-all duration-200 cursor-pointer ${
                    showResult && opt.isCorrect
                      ? 'border-[#10b981] bg-[rgba(16,185,129,0.15)] text-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                      : showResult && isSelected && !opt.isCorrect
                      ? 'border-[#ef4444] bg-[rgba(239,68,68,0.1)] text-[#ef4444]'
                      : showResult && !opt.isCorrect
                      ? 'border-[#1e2d45] bg-[#0d1117] text-[#475569] opacity-50'
                      : isSelected
                      ? 'border-[#7c3aed] bg-[rgba(124,58,237,0.15)] text-[#c4b5fd] shadow-[0_0_15px_rgba(124,58,237,0.2)]'
                      : 'border-[#1e2d45] bg-[#0d1117] text-[#e2e8f0] hover:border-[#7c3aed]/50 hover:bg-[rgba(124,58,237,0.05)]'
                  }`}
                >
                  <span className={`w-[28px] h-[28px] rounded-lg flex items-center justify-center font-bold text-xs shrink-0 font-mono transition-colors ${
                    showResult && opt.isCorrect
                      ? 'bg-[#10b981] text-white'
                      : showResult && isSelected && !opt.isCorrect
                      ? 'bg-[#ef4444] text-white'
                      : isSelected
                      ? 'bg-[#7c3aed] text-white'
                      : 'bg-[#1e2d45] text-[#e2e8f0]'
                  }`}>
                    {showResult && opt.isCorrect ? '✓' :
                     showResult && isSelected && !opt.isCorrect ? '✗' :
                     opt.letter}
                  </span>
                  <span className="flex-1">{opt.text}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* ── Fill in the blank ── */}
        {question.type === 'fill' && question.fillItems && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {question.fillItems.map((item, idx) => {
              const showAnswer = (state.isChecked && state.fillCorrect[idx] === false) || state.isSolutionRevealed
              const isCorrect = state.fillCorrect[idx]
              const isWrong = state.isChecked && state.fillCorrect[idx] === false

              return (
                <div key={idx} className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#64748b] font-mono" dir="ltr">{item.label}</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={state.fillAnswers[idx] || ''}
                      onChange={e => {
                        const newAnswers = { ...state.fillAnswers, [idx]: e.target.value }
                        onUpdate(question.id, { fillAnswers: newAnswers })
                      }}
                      disabled={state.isChecked}
                      placeholder="???"
                      dir="ltr"
                      className={`w-full px-3 py-2.5 rounded-lg font-mono text-sm border transition-all duration-200 outline-none ${
                        state.isChecked && isCorrect
                          ? 'bg-[rgba(16,185,129,0.1)] border-[#10b981] text-[#10b981]'
                          : isWrong
                          ? 'bg-[rgba(239,68,68,0.1)] border-[#ef4444] text-[#ef4444] line-through'
                          : 'bg-[#0d1117] border-[#1e2d45] text-[#e2e8f0] focus:border-[#00d4ff] focus:shadow-[0_0_10px_rgba(0,212,255,0.1)]'
                      }`}
                    />
                    {isWrong && (
                      <motion.span
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#10b981] font-mono text-sm font-bold"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        dir="ltr"
                      >
                        {item.answer}
                      </motion.span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Code / Trace textarea ── */}
        {(question.type === 'code' || question.type === 'trace') && (
          <div className="mt-3 relative">
            <textarea
              value={state.userCode}
              onChange={e => onUpdate(question.id, { userCode: e.target.value })}
              placeholder={question.type === 'trace' ? 'Write the expected output here...' : '#include <stdio.h>\nint main() {\n    ...\n}'}
              dir="ltr"
              className="w-full bg-[#0a0f1e] border border-[#1e2d45] rounded-xl p-4 font-mono text-[13px] text-[#e2e8f0] min-h-[120px] resize-y outline-none transition-all duration-200 focus:border-[#00d4ff] focus:shadow-[0_0_15px_rgba(0,212,255,0.1)] placeholder:text-[#334155]"
            />
            <div className="absolute top-2 right-2 text-[10px] text-[#334155] font-mono">
              {state.userCode.length > 0 ? `${state.userCode.split('\n').length} lines` : ''}
            </div>
          </div>
        )}

        {/* ── Action Buttons ── */}
        <div className="flex gap-2.5 mt-4 flex-wrap justify-end">
          {/* Check Answer */}
          {!state.isChecked && (
            <button
              onClick={() => {
                if (isMcqOrTf) onCheckMcq()
                else if (question.type === 'fill') onCheckFill()
                else onCheckCode()
              }}
              disabled={isMcqOrTf && !state.selectedMcq}
              className="bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] text-white border-none rounded-lg px-5 py-2.5 font-bold text-sm cursor-pointer hover:opacity-90 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-[0_0_20px_rgba(0,212,255,0.2)] disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            >
              Check ✓
            </button>
          )}

          {/* Show/Hide Solution */}
          {!state.isSolutionRevealed ? (
            <button
              onClick={onRevealSolution}
              className="bg-[rgba(16,185,129,0.15)] text-[#10b981] border border-[#10b981]/30 rounded-lg px-5 py-2.5 font-bold text-sm cursor-pointer hover:bg-[rgba(16,185,129,0.25)] transition-all"
            >
              Show Solution
            </button>
          ) : (
            <button
              onClick={onHideSolution}
              className="bg-[rgba(0,212,255,0.1)] text-[#00d4ff] border border-[#00d4ff]/30 rounded-lg px-5 py-2.5 font-bold text-sm cursor-pointer hover:bg-[rgba(0,212,255,0.2)] transition-all"
            >
              Hide Solution
            </button>
          )}

          {/* Reset */}
          {state.isChecked && (
            <button
              onClick={onReset}
              className="bg-transparent text-[#64748b] border border-[#1e2d45] rounded-lg px-4 py-2.5 text-sm cursor-pointer hover:border-[#64748b] transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* ── Feedback Message ── */}
        <AnimatePresence>
          {state.isChecked && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className={`mt-3 p-3.5 rounded-xl text-sm flex items-center gap-2.5 ${
                state.isCorrect === true
                  ? 'bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.25)] text-[#6ee7b7]'
                  : state.isCorrect === false
                  ? 'bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.25)] text-[#fca5a5]'
                  : 'bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.25)] text-[#fcd34d]'
              }`}>
                <span className="text-lg">
                  {state.isCorrect === true ? '✅' : state.isCorrect === false ? '❌' : '⚠️'}
                </span>
                <span className="font-bold">
                  {state.isCorrect === true ? 'Correct answer! Well done' :
                   state.isCorrect === false ? 'Wrong answer — check the solution below' :
                   'Submitted — review the model solution below'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Solution Section ── */}
        <AnimatePresence>
          {state.isSolutionRevealed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-5 rounded-xl bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.2)] text-[#6ee7b7]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[#00d4ff] text-lg">💡</span>
                  <span className="font-black text-[#00d4ff]">Model Solution:</span>
                </div>
                <div className="text-sm leading-relaxed mb-3">{question.answer}</div>
                {question.answerCode && (
                  <pre className="bg-[#0a0f1e] border border-[#1e2d45] rounded-lg p-4 font-mono text-xs whitespace-pre-wrap text-left shadow-[inset_0_0_30px_rgba(0,0,0,0.3)]" dir="ltr">
                    {question.answerCode}
                  </pre>
                )}
                {isMcqOrTf && question.mcqOptions && (
                  <div className="mt-2 text-xs text-[#6ee7b7]/70">
                    Correct answer: {question.mcqOptions.find(o => o.isCorrect)?.letter} — {question.mcqOptions.find(o => o.isCorrect)?.text}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
