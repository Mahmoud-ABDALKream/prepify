import { Section } from "./types"

export const iotSections: Section[] = [
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
  {
    id: 6,
    title: 'Actuators, Output Devices & Common Modules',
    marks: '50 pts',
    icon: '⚡',
    questions: [
      {
        id: 401,
        text: 'An actuator in an IoT system is best described as:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'A device that measures the environment', isCorrect: false },
          { letter: 'B', text: 'A device that stores program code', isCorrect: false },
          { letter: 'C', text: 'A device that changes the physical world (motion/sound/light)', isCorrect: true },
          { letter: 'D', text: 'A protocol used for Wi-Fi communication', isCorrect: false },
        ],
        answer: 'An actuator is a device that causes physical change in the environment — such as motion, sound, or light — based on control signals. Unlike sensors that measure the environment, actuators act upon it.',
      },
      {
        id: 402,
        text: 'A DC motor usually needs an external driver because:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Arduino/ESP32 pins cannot provide enough current for the motor', isCorrect: true },
          { letter: 'B', text: 'DC motors only work with analog sensors', isCorrect: false },
          { letter: 'C', text: 'Drivers are used only for LCD screens', isCorrect: false },
          { letter: 'D', text: 'PWM cannot be generated by microcontrollers', isCorrect: false },
        ],
        answer: 'Microcontroller I/O pins can typically source/sink only about 20–40 mA, while DC motors often require hundreds of milliamps or more. A motor driver (like L298N) acts as a power amplifier, allowing the microcontroller to safely control the motor.',
      },
      {
        id: 403,
        text: 'In L298N, the pins that mainly control speed (using PWM) are:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'OUT1 & OUT2', isCorrect: false },
          { letter: 'B', text: 'IN1 & IN2', isCorrect: false },
          { letter: 'C', text: 'ENA & ENB', isCorrect: true },
          { letter: 'D', text: 'VCC & GND', isCorrect: false },
        ],
        answer: 'ENA and ENB are the enable pins on the L298N. Applying a PWM signal to these pins controls the average voltage delivered to the motor, thus controlling its speed. OUT1/OUT2 connect to the motor, IN1/IN2 control direction, and VCC/GND are power.',
      },
      {
        id: 404,
        text: 'In L298N, for Motor A direction control, the important pins are:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'IN1 & IN2', isCorrect: true },
          { letter: 'B', text: 'ENB & IN4', isCorrect: false },
          { letter: 'C', text: 'VCC & 5V', isCorrect: false },
          { letter: 'D', text: 'OUT3 & OUT4', isCorrect: false },
        ],
        answer: 'IN1 and IN2 control the direction of Motor A. Setting IN1=HIGH, IN2=LOW makes it rotate one way; IN1=LOW, IN2=HIGH makes it reverse. IN3 & IN4 do the same for Motor B.',
      },
      {
        id: 405,
        text: 'On L298N, the pins connected directly to Motor A wires are:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'ENA & ENB', isCorrect: false },
          { letter: 'B', text: 'OUT1 & OUT2', isCorrect: true },
          { letter: 'C', text: 'IN3 & IN4', isCorrect: false },
          { letter: 'D', text: 'VCC & GND', isCorrect: false },
        ],
        answer: 'OUT1 and OUT2 are the output terminals that connect directly to Motor A wires. The L298N internal H-bridge routes power from the supply through these terminals to drive the motor in either direction.',
      },
      {
        id: 406,
        text: 'L298N requires two power sections mainly because:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'One is for ADC and the other is for DAC', isCorrect: false },
          { letter: 'B', text: 'One powers motors (higher voltage) and one powers module logic (5V)', isCorrect: true },
          { letter: 'C', text: 'One is for Bluetooth and the other is for RFID', isCorrect: false },
          { letter: 'D', text: 'One is for servo and the other is for joystick', isCorrect: false },
        ],
        answer: 'The L298N has a motor power supply (VCC, typically 6–12V or more) that drives the motors, and a logic power supply (5V) that runs the internal circuitry of the driver chip. Separating them prevents motor noise from affecting logic and allows different voltage levels.',
      },
      {
        id: 407,
        text: 'A servo motor is mainly used when you need:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Continuous rotation only with no position control', isCorrect: false },
          { letter: 'B', text: 'Accurate angle/position control (like 0°–180°)', isCorrect: true },
          { letter: 'C', text: 'High-speed networking', isCorrect: false },
          { letter: 'D', text: 'Reading analog sensors', isCorrect: false },
        ],
        answer: 'A servo motor provides precise angular positioning, typically in the range of 0° to 180°. It uses internal feedback (a potentiometer) to maintain the commanded position, making it ideal for applications requiring accurate position control.',
      },
      {
        id: 408,
        text: 'Typical servo pins (3 wires) are:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'SDA, SCL, VCC', isCorrect: false },
          { letter: 'B', text: 'MISO, MOSI, SCK', isCorrect: false },
          { letter: 'C', text: 'VCC, GND, Signal', isCorrect: true },
          { letter: 'D', text: 'TX, RX, State', isCorrect: false },
        ],
        answer: 'A standard servo has 3 wires: VCC (usually red, 5V power), GND (usually brown/black, ground), and Signal (usually orange/yellow, receives the PWM control pulse from the microcontroller).',
      },
      {
        id: 409,
        text: 'The servo Signal wire typically carries:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'PWM control signal from a microcontroller pin', isCorrect: true },
          { letter: 'B', text: 'Motor supply voltage (35V)', isCorrect: false },
          { letter: 'C', text: 'I2C data', isCorrect: false },
          { letter: 'D', text: 'SPI clock', isCorrect: false },
        ],
        answer: 'The servo signal wire receives a PWM control signal from the microcontroller. The pulse width (typically 1ms–2ms) determines the angle the servo moves to. This is a low-current control signal, not the motor power supply.',
      },
      {
        id: 410,
        text: 'The joystick module provides:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: '2 digital outputs only', isCorrect: false },
          { letter: 'B', text: '1 analog output only', isCorrect: false },
          { letter: 'C', text: '2 analog outputs (VRX/VRY) + 1 digital button (SW)', isCorrect: true },
          { letter: 'D', text: 'Only PWM signals', isCorrect: false },
        ],
        answer: 'A typical joystick module has two potentiometers for the X and Y axes (VRX and VRY, both analog outputs), plus a pushbutton (SW, digital output) activated by pressing the joystick knob down.',
      },
      {
        id: 411,
        text: 'Joystick pin VRX represents:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Vertical axis analog value', isCorrect: false },
          { letter: 'B', text: 'Horizontal axis analog value', isCorrect: true },
          { letter: 'C', text: 'Power supply input', isCorrect: false },
          { letter: 'D', text: 'Button output', isCorrect: false },
        ],
        answer: 'VRX provides the analog voltage corresponding to the horizontal (X-axis) position of the joystick. VRY provides the vertical (Y-axis) value. Both range from 0 to the supply voltage (e.g., 0–5V or 0–3.3V).',
      },
      {
        id: 412,
        text: 'Joystick pin SW is described as:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Always HIGH', isCorrect: false },
          { letter: 'B', text: 'Always LOW', isCorrect: false },
          { letter: 'C', text: 'A normally-open pushbutton output', isCorrect: true },
          { letter: 'D', text: 'An ADC reference pin', isCorrect: false },
        ],
        answer: 'SW is a normally-open pushbutton output. When the joystick knob is pressed down, the switch closes and the SW pin connects to ground. With a pull-up resistor, this reads as HIGH when not pressed and LOW when pressed.',
      },
      {
        id: 413,
        text: 'If SW uses a pull-up resistor, the SW pin reads:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'LOW when not pressed, HIGH when pressed', isCorrect: false },
          { letter: 'B', text: 'HIGH when not pressed, LOW when pressed', isCorrect: true },
          { letter: 'C', text: 'Always floating', isCorrect: false },
          { letter: 'D', text: 'Always HIGH', isCorrect: false },
        ],
        answer: 'With a pull-up resistor, the SW pin is pulled HIGH by default (not pressed). When the button is pressed, it connects the pin to ground, making it read LOW. This is the standard behavior of a normally-open switch with a pull-up.',
      },
      {
        id: 414,
        text: 'OLED module shown uses the interface:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'SPI (MOSI/MISO/SCK/CS)', isCorrect: false },
          { letter: 'B', text: 'I2C (SDA/SCL)', isCorrect: true },
          { letter: 'C', text: 'UART (TX/RX)', isCorrect: false },
          { letter: 'D', text: 'PWM (ENA/ENB)', isCorrect: false },
        ],
        answer: 'The common small OLED display modules (like SSD1306 0.96") typically use the I2C interface, requiring only two data lines (SDA for data and SCL for clock), plus power. Some OLED modules also support SPI for faster data transfer.',
      },
      {
        id: 415,
        text: 'On I2C OLED, the SCL pin is:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Power pin', isCorrect: false },
          { letter: 'B', text: 'Serial clock pin', isCorrect: true },
          { letter: 'C', text: 'Serial data pin', isCorrect: false },
          { letter: 'D', text: 'Reset pin', isCorrect: false },
        ],
        answer: 'SCL stands for Serial Clock Line. It is the clock signal generated by the I2C master that synchronizes data transfer on the bus. The slave devices use this clock to know when to read or write data on the SDA line.',
      },
      {
        id: 416,
        text: 'On I2C OLED, the SDA pin is:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Serial data pin', isCorrect: true },
          { letter: 'B', text: 'Serial clock pin', isCorrect: false },
          { letter: 'C', text: 'Motor enable pin', isCorrect: false },
          { letter: 'D', text: 'Interrupt pin', isCorrect: false },
        ],
        answer: 'SDA stands for Serial Data Line. It carries the actual data being transmitted between the master and slave devices on the I2C bus. Data is sent in sync with the SCL clock signal.',
      },
      {
        id: 417,
        text: 'The LCD 16×2 pin Vo is mainly used for:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Selecting SPI mode', isCorrect: false },
          { letter: 'B', text: 'Contrast control', isCorrect: true },
          { letter: 'C', text: 'Motor direction', isCorrect: false },
          { letter: 'D', text: 'UART receive', isCorrect: false },
        ],
        answer: 'Pin Vo (or V0) on a 16×2 LCD is the contrast adjustment pin. It is typically connected to the wiper of a potentiometer between VCC and GND, allowing you to adjust the display contrast for optimal readability.',
      },
      {
        id: 418,
        text: 'LCD pin RS typically means:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Register Select (data vs command)', isCorrect: true },
          { letter: 'B', text: 'Reset Signal', isCorrect: false },
          { letter: 'C', text: 'Relay Switch', isCorrect: false },
          { letter: 'D', text: 'Read Sensor', isCorrect: false },
        ],
        answer: 'RS stands for Register Select. When RS=LOW, the LCD interprets input as a command (like clearing the display or setting cursor position). When RS=HIGH, it treats input as data (character to display).',
      },
      {
        id: 419,
        text: 'In common LCD 4-bit wiring, data pins often used are:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'D0–D3 only', isCorrect: false },
          { letter: 'B', text: 'D4–D7 only', isCorrect: true },
          { letter: 'C', text: 'A and K only', isCorrect: false },
          { letter: 'D', text: 'RS and Vo only', isCorrect: false },
        ],
        answer: 'In 4-bit mode, only the upper 4 data pins (D4–D7) are connected to the microcontroller. Each byte of data is sent as two sequential 4-bit nibbles, which saves 4 I/O pins compared to 8-bit mode.',
      },
      {
        id: 420,
        text: 'LCD pins A and K are commonly related to:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'I2C bus', isCorrect: false },
          { letter: 'B', text: 'Backlight (Anode/Cathode)', isCorrect: true },
          { letter: 'C', text: 'Servo position', isCorrect: false },
          { letter: 'D', text: 'RFID antenna', isCorrect: false },
        ],
        answer: 'A (Anode) and K (Kathode/Cathode) are the backlight power pins on the LCD. Connecting A to 5V and K to GND turns on the LED backlight, making the display readable in dark environments.',
      },
      {
        id: 421,
        text: 'RFID RC522 module must be powered by:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: '12V', isCorrect: false },
          { letter: 'B', text: '9V', isCorrect: false },
          { letter: 'C', text: '5V only', isCorrect: false },
          { letter: 'D', text: '3.3V', isCorrect: true },
        ],
        answer: 'The RC522 RFID module operates at 3.3V. Connecting it to 5V can damage the module. When using it with a 5V Arduino, level shifters or voltage dividers are recommended on the signal lines to protect the RC522.',
      },
      {
        id: 422,
        text: 'RC522 pin RST is mainly used for:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Reset / power-down control', isCorrect: true },
          { letter: 'B', text: 'Motor direction', isCorrect: false },
          { letter: 'C', text: 'PWM output', isCorrect: false },
          { letter: 'D', text: 'LCD contrast', isCorrect: false },
        ],
        answer: 'The RST (Reset) pin on the RC522 is used to reset the module or put it into power-down mode. Pulling RST LOW resets the chip, and it can also be used to conserve power by putting the module to sleep when not actively reading tags.',
      },
      {
        id: 423,
        text: 'RC522 pin IRQ is used to:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Provide analog output for joystick', isCorrect: false },
          { letter: 'B', text: 'Alert microcontroller when a tag is detected (interrupt)', isCorrect: true },
          { letter: 'C', text: 'Power the module', isCorrect: false },
          { letter: 'D', text: 'Provide UART clock', isCorrect: false },
        ],
        answer: 'The IRQ (Interrupt Request) pin signals the microcontroller when an event occurs, such as when an RFID tag enters the reader field. This allows the microcontroller to use interrupt-driven detection rather than constant polling.',
      },
      {
        id: 424,
        text: 'RC522 pin labeled MISO/SCL/TX means it can act as:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Only SPI clock always', isCorrect: false },
          { letter: 'B', text: 'Different functions depending on selected mode (SPI/I2C/UART)', isCorrect: true },
          { letter: 'C', text: 'Only power input', isCorrect: false },
          { letter: 'D', text: 'Only PWM output', isCorrect: false },
        ],
        answer: 'The RC522 supports multiple communication interfaces (SPI, I2C, and UART). The same physical pin can serve as MISO in SPI mode, SCL in I2C mode, or TX in UART mode, depending on which interface is configured.',
      },
      {
        id: 425,
        text: 'Bluetooth HC-05/HC-06 TX should connect to Arduino:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'RX', isCorrect: true },
          { letter: 'B', text: 'TX', isCorrect: false },
          { letter: 'C', text: 'GND', isCorrect: false },
          { letter: 'D', text: '5V', isCorrect: false },
        ],
        answer: 'Bluetooth TX (transmit) must connect to Arduino RX (receive) because one device\'s output is the other\'s input. This crossover connection allows serial data to flow between the two devices.',
      },
      {
        id: 426,
        text: 'Bluetooth HC-05/HC-06 RX should connect to Arduino:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'SDA', isCorrect: false },
          { letter: 'B', text: 'TX', isCorrect: true },
          { letter: 'C', text: 'SCL', isCorrect: false },
          { letter: 'D', text: 'ENA', isCorrect: false },
        ],
        answer: 'Bluetooth RX (receive) must connect to Arduino TX (transmit). This cross-connection ensures that data transmitted by the Arduino is received by the Bluetooth module and vice versa.',
      },
      {
        id: 427,
        text: 'The Bluetooth State pin is mainly used as:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'PWM input for motor speed', isCorrect: false },
          { letter: 'B', text: 'Feedback linked to onboard LED (connection/status indication)', isCorrect: true },
          { letter: 'C', text: 'I2C clock', isCorrect: false },
          { letter: 'D', text: 'ADC input', isCorrect: false },
        ],
        answer: 'The State pin on HC-05/HC-06 reflects the Bluetooth connection status, typically linked to the onboard LED. It can indicate whether the module is paired, connected, or in pairing mode, allowing the microcontroller to monitor the connection state.',
      },
      // ─── Additional related MCQ questions ───
      {
        id: 428,
        text: 'Which of the following is an example of an actuator in a smart home?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Temperature sensor', isCorrect: false },
          { letter: 'B', text: 'Smart door lock', isCorrect: true },
          { letter: 'C', text: 'Humidity sensor', isCorrect: false },
          { letter: 'D', text: 'Light sensor', isCorrect: false },
        ],
        answer: 'A smart door lock is an actuator because it physically changes the state of the door (locked/unlocked) based on control signals. Sensors (temperature, humidity, light) only measure the environment and do not cause physical change.',
      },
      {
        id: 429,
        text: 'What is the main function of an H-bridge in motor control?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Convert analog signals to digital', isCorrect: false },
          { letter: 'B', text: 'Allow the motor to rotate in both directions', isCorrect: true },
          { letter: 'C', text: 'Measure motor speed', isCorrect: false },
          { letter: 'D', text: 'Store motor calibration data', isCorrect: false },
        ],
        answer: 'An H-bridge is an electronic circuit that enables voltage to be applied across a motor in either direction, allowing bidirectional rotation. The L298N contains two H-bridges, enabling it to control two DC motors independently.',
      },
      {
        id: 430,
        text: 'If IN1=HIGH and IN2=LOW on L298N Motor A, what happens?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Motor A rotates in one direction', isCorrect: true },
          { letter: 'B', text: 'Motor A rotates in the opposite direction', isCorrect: false },
          { letter: 'C', text: 'Motor A stops (brake)', isCorrect: false },
          { letter: 'D', text: 'Motor A free-runs (coast)', isCorrect: false },
        ],
        answer: 'When IN1=HIGH and IN2=LOW, current flows through Motor A in one direction, causing it to rotate forward. Reversing (IN1=LOW, IN2=HIGH) makes it rotate the opposite way. Both HIGH or both LOW causes stop/brake.',
      },
      {
        id: 431,
        text: 'If both IN1 and IN2 are LOW on L298N Motor A, the motor:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Rotates at full speed', isCorrect: false },
          { letter: 'B', text: 'Rotates in reverse', isCorrect: false },
          { letter: 'C', text: 'Stops (coast/free-run)', isCorrect: true },
          { letter: 'D', text: 'Overheats', isCorrect: false },
        ],
        answer: 'When both IN1 and IN2 are LOW, no current flows through the motor, and it coasts to a stop (free-run). This is different from active braking where both pins are HIGH, which creates a short-circuit brake that stops the motor more quickly.',
      },
      {
        id: 432,
        text: 'What duty cycle value on ENA would make Motor A run at approximately half speed?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: '0%', isCorrect: false },
          { letter: 'B', text: '25%', isCorrect: false },
          { letter: 'C', text: '50%', isCorrect: true },
          { letter: 'D', text: '100%', isCorrect: false },
        ],
        answer: 'A 50% duty cycle on the PWM signal applied to ENA means the motor receives power for half the time, resulting in approximately half the average voltage and thus roughly half speed. 0% = stopped, 100% = full speed.',
      },
      {
        id: 433,
        text: 'What is the difference between a standard servo and a continuous rotation servo?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'They are identical in every way', isCorrect: false },
          { letter: 'B', text: 'Standard servo controls angle (0°–180°), continuous rotation servo controls speed and direction', isCorrect: true },
          { letter: 'C', text: 'Continuous rotation servo is more precise in positioning', isCorrect: false },
          { letter: 'D', text: 'Standard servo spins continuously', isCorrect: false },
        ],
        answer: 'A standard servo moves to a specific angle (0°–180°) based on the PWM pulse width. A continuous rotation servo removes the position stop and instead interprets pulse width as speed and direction — center pulse stops it, shorter pulses spin one way, longer pulses the other.',
      },
      {
        id: 434,
        text: 'What is the typical PWM pulse width range for a standard servo (0° to 180°)?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: '0.5ms to 1.0ms', isCorrect: false },
          { letter: 'B', text: '1.0ms to 2.0ms', isCorrect: true },
          { letter: 'C', text: '5.0ms to 10.0ms', isCorrect: false },
          { letter: 'D', text: '20ms to 50ms', isCorrect: false },
        ],
        answer: 'A standard servo typically uses pulse widths from 1.0ms (0° position) to 2.0ms (180° position), with 1.5ms being the center (90°). The PWM signal usually has a 20ms period (50Hz refresh rate).',
      },
      {
        id: 435,
        text: 'When using a joystick module, the analog readings at the center (neutral) position are typically around:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: '0 (minimum value)', isCorrect: false },
          { letter: 'B', text: 'Approximately half of the ADC range (e.g., ~512 on 10-bit ADC)', isCorrect: true },
          { letter: 'C', text: '1023 (maximum value)', isCorrect: false },
          { letter: 'D', text: 'A random value each time', isCorrect: false },
        ],
        answer: 'At the center position, both potentiometers are at their midpoint, producing approximately half the supply voltage. On a 10-bit ADC (0–1023), this reads around 512. Pushing the joystick fully in any direction moves the value toward 0 or 1023.',
      },
      {
        id: 436,
        text: 'Which Arduino function is used to read the analog values from a joystick module?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'digitalRead()', isCorrect: false },
          { letter: 'B', text: 'analogRead()', isCorrect: true },
          { letter: 'C', text: 'Serial.read()', isCorrect: false },
          { letter: 'D', text: 'pulseIn()', isCorrect: false },
        ],
        answer: 'analogRead() reads the voltage on an analog pin and converts it to a digital value (0–1023 on 10-bit ADC). This is used for VRX and VRY joystick outputs. digitalRead() is used for the SW button (digital pin).',
      },
      {
        id: 437,
        text: 'In I2C communication, what is the role of pull-up resistors on SDA and SCL lines?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'They protect against overvoltage', isCorrect: false },
          { letter: 'B', text: 'They ensure the lines default to HIGH when no device is pulling them LOW', isCorrect: true },
          { letter: 'C', text: 'They limit current to the OLED display', isCorrect: false },
          { letter: 'D', text: 'They convert I2C to SPI signals', isCorrect: false },
        ],
        answer: 'I2C uses open-drain/open-collector outputs, meaning devices can only pull lines LOW. Pull-up resistors ensure the lines return to HIGH when no device is actively pulling them LOW. Without pull-up resistors, the I2C bus cannot function.',
      },
      {
        id: 438,
        text: 'What is the default I2C address of the common SSD1306 OLED display module?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: '0x27', isCorrect: false },
          { letter: 'B', text: '0x3C', isCorrect: true },
          { letter: 'C', text: '0x40', isCorrect: false },
          { letter: 'D', text: '0x50', isCorrect: false },
        ],
        answer: 'The SSD1306 OLED display commonly uses I2C address 0x3C (or sometimes 0x3D). 0x27 is typically used by I2C LCD backpacks. The address must be specified correctly in the code for the display to work.',
      },
      {
        id: 439,
        text: 'How many custom characters can a 16×2 LCD typically store?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: '2', isCorrect: false },
          { letter: 'B', text: '4', isCorrect: false },
          { letter: 'C', text: '8', isCorrect: true },
          { letter: 'D', text: '16', isCorrect: false },
        ],
        answer: 'The HD44780 controller (used in most 16×2 LCDs) has CGRAM (Character Generator RAM) that can store up to 8 custom characters, each defined as a 5×8 pixel pattern. These can be displayed alongside the built-in character set.',
      },
      {
        id: 440,
        text: 'What does the LCD pin E (Enable) do?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Erases the display', isCorrect: false },
          { letter: 'B', text: 'Enables the backlight', isCorrect: false },
          { letter: 'C', text: 'Signals the LCD to read data on the data pins when toggled', isCorrect: true },
          { letter: 'D', text: 'Enables I2C communication', isCorrect: false },
        ],
        answer: 'The Enable (E) pin is used to trigger the LCD to read the data currently on its input pins. When the microcontroller toggles E from HIGH to LOW, the LCD reads and processes the data/command present on D0–D7 (or D4–D7 in 4-bit mode).',
      },
      {
        id: 441,
        text: 'What is the operating frequency of the RC522 RFID reader?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: '125 kHz (Low Frequency)', isCorrect: false },
          { letter: 'B', text: '13.56 MHz (High Frequency)', isCorrect: true },
          { letter: 'C', text: '868 MHz (UHF)', isCorrect: false },
          { letter: 'D', text: '2.4 GHz (Microwave)', isCorrect: false },
        ],
        answer: 'The RC522 operates at 13.56 MHz (High Frequency / HF band), which is the standard for NFC and many smart card applications. 125 kHz is used by older, lower-frequency RFID systems that have shorter read ranges.',
      },
      {
        id: 442,
        text: 'Which RFID tag type is commonly used with the RC522 module?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'EM4100 (125 kHz)', isCorrect: false },
          { letter: 'B', text: 'MIFARE Classic 1K (13.56 MHz)', isCorrect: true },
          { letter: 'C', text: 'UHF EPC Gen2 tag', isCorrect: false },
          { letter: 'D', text: 'Bluetooth beacon tag', isCorrect: false },
        ],
        answer: 'The RC522 is designed to work with MIFARE Classic tags and other 13.56 MHz ISO 14443A cards. EM4100 tags operate at 125 kHz and are incompatible with the RC522. UHF and Bluetooth tags use entirely different technologies.',
      },
      {
        id: 443,
        text: 'What is the typical communication range of the RC522 RFID module?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: '0–1 meter', isCorrect: false },
          { letter: 'B', text: 'Approximately 0–5 cm', isCorrect: true },
          { letter: 'C', text: '0–50 meters', isCorrect: false },
          { letter: 'D', text: '0–1 km', isCorrect: false },
        ],
        answer: 'The RC522 has a very short read range of approximately 5 cm, typical of 13.56 MHz NFC/RFID systems. The tag must be held very close to the antenna. This short range is by design for security and precise identification.',
      },
      {
        id: 444,
        text: 'What is the default baud rate of the HC-05 Bluetooth module in AT command mode?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: '9600', isCorrect: true },
          { letter: 'B', text: '115200', isCorrect: false },
          { letter: 'C', text: '4800', isCorrect: false },
          { letter: 'D', text: '19200', isCorrect: false },
        ],
        answer: 'The HC-05 defaults to 9600 baud in AT command mode (when the EN/KEY pin is HIGH at power-up). In communication mode, it may use a different baud rate (often 38400 or 9600), which can be configured via AT commands.',
      },
      {
        id: 445,
        text: 'What voltage level should be used when connecting HC-05 RX to Arduino TX on a 5V Arduino?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Direct 5V connection is safe', isCorrect: false },
          { letter: 'B', text: 'A voltage divider should be used to step down to 3.3V', isCorrect: true },
          { letter: 'C', text: 'No connection is needed', isCorrect: false },
          { letter: 'D', text: 'Connect through a 12V power supply', isCorrect: false },
        ],
        answer: 'The HC-05 RX pin operates at 3.3V logic level. When interfacing with a 5V Arduino TX, a voltage divider (using two resistors) should be used to reduce the 5V signal to 3.3V. The HC-05 TX can be connected directly to Arduino RX since 3.3V is sufficient for a HIGH logic level on most 5V Arduinos.',
      },
      {
        id: 446,
        text: 'What is the difference between HC-05 and HC-06 Bluetooth modules?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'They are identical', isCorrect: false },
          { letter: 'B', text: 'HC-05 can act as both master and slave; HC-06 can only act as slave', isCorrect: true },
          { letter: 'C', text: 'HC-06 has longer range than HC-05', isCorrect: false },
          { letter: 'D', text: 'HC-05 uses WiFi while HC-06 uses Bluetooth', isCorrect: false },
        ],
        answer: 'The HC-05 can operate in both master and slave modes, allowing it to initiate connections to other Bluetooth devices. The HC-06 is slave-only — it can only accept incoming connections. Both use Bluetooth Classic (not BLE).',
      },
      {
        id: 447,
        text: 'Which Arduino library is commonly used to control standard servo motors?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Wire.h', isCorrect: false },
          { letter: 'B', text: 'Servo.h', isCorrect: true },
          { letter: 'C', text: 'SPI.h', isCorrect: false },
          { letter: 'D', text: 'SoftwareSerial.h', isCorrect: false },
        ],
        answer: 'The Servo.h library provides functions like attach(), write(), and read() to easily control servo motors. Wire.h is for I2C, SPI.h is for SPI communication, and SoftwareSerial.h is for software serial communication.',
      },
      {
        id: 448,
        text: 'Which Arduino library is commonly used to communicate with RC522 RFID module?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Servo.h', isCorrect: false },
          { letter: 'B', text: 'MFRC522.h', isCorrect: true },
          { letter: 'C', text: 'LiquidCrystal.h', isCorrect: false },
          { letter: 'D', text: 'ESP8266WiFi.h', isCorrect: false },
        ],
        answer: 'The MFRC522 library provides functions to interface with the RC522 RFID reader module over SPI. LiquidCrystal.h is for LCD displays, Servo.h is for servo motors, and ESP8266WiFi.h is for WiFi on ESP8266.',
      },
      {
        id: 449,
        text: 'On ESP32, which pins are the default I2C SDA and SCL pins?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'GPIO 0 and GPIO 2', isCorrect: false },
          { letter: 'B', text: 'GPIO 21 (SDA) and GPIO 22 (SCL)', isCorrect: true },
          { letter: 'C', text: 'GPIO 4 and GPIO 5', isCorrect: false },
          { letter: 'D', text: 'GPIO 12 and GPIO 14', isCorrect: false },
        ],
        answer: 'On ESP32, the default I2C pins are GPIO 21 (SDA) and GPIO 22 (SCL). Unlike Arduino Uno (A4/A5), the ESP32 uses these dedicated pins, though I2C can be remapped to almost any GPIO pin using the Wire library.',
      },
      {
        id: 450,
        text: 'What happens if you connect a 5V servo signal directly to a 3.3V ESP32 pin?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Nothing, it works perfectly', isCorrect: false },
          { letter: 'B', text: 'The ESP32 pin could be damaged by overvoltage', isCorrect: true },
          { letter: 'C', text: 'The servo will spin faster', isCorrect: false },
          { letter: 'D', text: 'The signal is automatically converted', isCorrect: false },
        ],
        answer: 'While the servo signal wire is an output from the microcontroller (so the ESP32 sends TO the servo, not the other way), the concern is that a 5V-powered servo could potentially feed voltage back. The signal from ESP32 (3.3V) is generally sufficient to control the servo, but care should be taken with power supply connections and shared grounds.',
      },
    ],
  },
  {
    id: 7,
    title: 'Arduino IDE & Programming',
    marks: '45 pts',
    icon: '🔌',
    questions: [
      // ─── MCQ Questions: Arduino IDE Concepts ───
      {
        id: 501,
        text: 'Arduino IDE stands for:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Arduino Internet Development Environment', isCorrect: false },
          { letter: 'B', text: 'Arduino Integrated Development Environment', isCorrect: true },
          { letter: 'C', text: 'Arduino Internal Design Engine', isCorrect: false },
          { letter: 'D', text: 'Arduino Interactive Data Editor', isCorrect: false },
        ],
        answer: 'Arduino IDE stands for Arduino Integrated Development Environment — the official software used to write, compile, and upload code to Arduino boards.',
      },
      {
        id: 502,
        text: 'Which of the following is NOT a main section of the Arduino IDE?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Toolbar', isCorrect: false },
          { letter: 'B', text: 'Code Editor', isCorrect: false },
          { letter: 'C', text: 'Database Manager', isCorrect: true },
          { letter: 'D', text: 'Status Bar', isCorrect: false },
        ],
        answer: 'The six main sections of Arduino IDE are: Toolbar, Menus, Code Editor, Status Bar, Program Notifications, and Board & Serial Port Selections. There is no Database Manager section.',
      },
      {
        id: 503,
        text: 'What is the correct workflow when using Arduino IDE?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Write code → Upload → Connect board → Select port', isCorrect: false },
          { letter: 'B', text: 'Connect board → Select board/port → Write code → Verify → Upload', isCorrect: true },
          { letter: 'C', text: 'Upload → Write code → Verify → Connect board', isCorrect: false },
          { letter: 'D', text: 'Select port → Upload → Write code → Verify', isCorrect: false },
        ],
        answer: 'The correct workflow is: connect the board via USB, select the correct board type and COM port, write the code, verify/compile it, then upload it to the board.',
      },
      {
        id: 504,
        text: 'What happens if you select the wrong COM port in Arduino IDE?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'The code will upload to a different board', isCorrect: false },
          { letter: 'B', text: 'The code will not upload', isCorrect: true },
          { letter: 'C', text: 'The IDE will auto-correct the port', isCorrect: false },
          { letter: 'D', text: 'The board will be damaged', isCorrect: false },
        ],
        answer: 'If the wrong board or wrong port is selected, the code will not upload. The IDE cannot communicate with the Arduino board through an incorrect serial port.',
      },
      {
        id: 505,
        text: 'In Arduino IDE, the Verify button is used to:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Upload the code to the board', isCorrect: false },
          { letter: 'B', text: 'Check for syntax errors and compile the code', isCorrect: true },
          { letter: 'C', text: 'Open the Serial Monitor', isCorrect: false },
          { letter: 'D', text: 'Delete the current sketch', isCorrect: false },
        ],
        answer: 'The Verify/Compile button checks the code for syntax errors and converts it into machine-readable form without uploading. The Upload button both compiles and sends the code to the board.',
      },
      {
        id: 506,
        text: 'The setup() function in an Arduino program:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Runs continuously in a loop', isCorrect: false },
          { letter: 'B', text: 'Runs only once when the Arduino starts', isCorrect: true },
          { letter: 'C', text: 'Runs every time a button is pressed', isCorrect: false },
          { letter: 'D', text: 'Is optional and can be omitted', isCorrect: false },
        ],
        answer: 'setup() runs only once when the Arduino powers on or resets. It is used for initial settings like defining pin modes, initializing libraries, and setting up serial communication.',
      },
      {
        id: 507,
        text: 'The loop() function in an Arduino program:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Runs only once after setup()', isCorrect: false },
          { letter: 'B', text: 'Runs again and again continuously', isCorrect: true },
          { letter: 'C', text: 'Only runs when an interrupt occurs', isCorrect: false },
          { letter: 'D', text: 'Replaces the need for setup()', isCorrect: false },
        ],
        answer: 'loop() runs continuously after setup() completes. It contains the main behavior of the program — the code inside loop() repeats over and over as long as the Arduino is powered.',
      },
      {
        id: 508,
        text: 'What does pinMode(13, OUTPUT) do?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Reads a value from pin 13', isCorrect: false },
          { letter: 'B', text: 'Sets pin 13 as an output pin', isCorrect: true },
          { letter: 'C', text: 'Turns on the LED on pin 13', isCorrect: false },
          { letter: 'D', text: 'Sets pin 13 as an input pin', isCorrect: false },
        ],
        answer: 'pinMode(pin, mode) configures a pin as either INPUT or OUTPUT. pinMode(13, OUTPUT) tells Arduino that pin 13 will be used to send signals to an output device like an LED.',
      },
      {
        id: 509,
        text: 'What does digitalWrite(13, HIGH) do?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Reads the digital value on pin 13', isCorrect: false },
          { letter: 'B', text: 'Sends 5V (ON) signal to pin 13', isCorrect: true },
          { letter: 'C', text: 'Sets pin 13 as an input', isCorrect: false },
          { letter: 'D', text: 'Sends 0V (OFF) signal to pin 13', isCorrect: false },
        ],
        answer: 'digitalWrite(pin, value) sends a digital signal. HIGH = 5V (ON), LOW = 0V (OFF). digitalWrite(13, HIGH) sends 5V to pin 13, turning on whatever is connected (like an LED).',
      },
      {
        id: 510,
        text: 'What does delay(1000) do in Arduino code?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Pauses the program for 1 millisecond', isCorrect: false },
          { letter: 'B', text: 'Pauses the program for 1 second (1000 milliseconds)', isCorrect: true },
          { letter: 'C', text: 'Pauses the program for 1000 seconds', isCorrect: false },
          { letter: 'D', text: 'Creates a loop that runs 1000 times', isCorrect: false },
        ],
        answer: 'delay(ms) pauses the program for the specified number of milliseconds. delay(1000) pauses for 1000 milliseconds = 1 second. During this time, the Arduino does nothing.',
      },
      {
        id: 511,
        text: 'Which variable type would you use to store a decimal number like 3.14 in Arduino?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'int', isCorrect: false },
          { letter: 'B', text: 'char', isCorrect: false },
          { letter: 'C', text: 'float', isCorrect: true },
          { letter: 'D', text: 'word', isCorrect: false },
        ],
        answer: 'float is used for decimal/floating-point numbers. int stores whole numbers, char stores single characters, and word stores unsigned 16-bit integers.',
      },
      {
        id: 512,
        text: 'Which function is used to read a digital input from a pin in Arduino?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'digitalWrite()', isCorrect: false },
          { letter: 'B', text: 'analogRead()', isCorrect: false },
          { letter: 'C', text: 'digitalRead()', isCorrect: true },
          { letter: 'D', text: 'pinMode()', isCorrect: false },
        ],
        answer: 'digitalRead(pin) reads the current state of a digital pin (HIGH or LOW). digitalWrite() writes a value, analogRead() reads analog values, and pinMode() sets the pin mode.',
      },
      {
        id: 513,
        text: 'Which function is used to read an analog value from a pin in Arduino?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'digitalRead()', isCorrect: false },
          { letter: 'B', text: 'analogRead()', isCorrect: true },
          { letter: 'C', text: 'analogWrite()', isCorrect: false },
          { letter: 'D', text: 'digitalWrite()', isCorrect: false },
        ],
        answer: 'analogRead(pin) reads the analog voltage on a pin and returns a value from 0 to 1023 (10-bit ADC). It is used with analog pins (A0, A1, etc.) for reading sensor values.',
      },
      {
        id: 514,
        text: 'In Arduino, what is the range of values returned by analogRead()?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: '0 to 255', isCorrect: false },
          { letter: 'B', text: '0 to 1023', isCorrect: true },
          { letter: 'C', text: '0 to 5', isCorrect: false },
          { letter: 'D', text: '0 to 65535', isCorrect: false },
        ],
        answer: 'analogRead() returns a value from 0 to 1023 because the Arduino has a 10-bit ADC (2^10 = 1024 possible values). 0 corresponds to 0V and 1023 corresponds to 5V (or the reference voltage).',
      },
      {
        id: 515,
        text: 'Which Arduino IDE menu is used to select the board type and COM port?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'File menu', isCorrect: false },
          { letter: 'B', text: 'Edit menu', isCorrect: false },
          { letter: 'C', text: 'Tools menu', isCorrect: true },
          { letter: 'D', text: 'Sketch menu', isCorrect: false },
        ],
        answer: 'The Tools menu provides options for board selection, port selection, auto format, and other utility functions needed for configuring the Arduino IDE.',
      },
      // ─── Code Questions: From Tutorial 7 ───
      {
        id: 516,
        text: 'Write Arduino code to turn on an LED connected to pin 13.',
        marks: '3 pts',
        type: 'code',
        answer: 'Set pin 13 as OUTPUT in setup(), then write HIGH to pin 13 in loop() to keep the LED on.',
        answerCode: `void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
}`,
        hint: 'Use pinMode() in setup() and digitalWrite() in loop().',
      },
      {
        id: 517,
        text: 'Write Arduino code to make an LED connected to pin 13 blink every 1 second.',
        marks: '3 pts',
        type: 'code',
        answer: 'Turn the LED on with HIGH, wait 1 second, turn it off with LOW, wait 1 second — all inside loop() so it repeats.',
        answerCode: `void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}`,
        hint: 'Use delay(1000) between HIGH and LOW to create a 1-second blink.',
      },
      {
        id: 518,
        text: 'A button is connected to pin 2 and an LED is connected to pin 13. Write Arduino code so the LED turns on when the button is pressed, and off when released.',
        marks: '4 pts',
        type: 'code',
        answer: 'Read the button state with digitalRead(). If HIGH (pressed), turn LED on. Otherwise, turn LED off.',
        answerCode: `int buttonPin = 2;
int ledPin = 13;
int buttonState = 0;

void setup() {
  pinMode(buttonPin, INPUT);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  buttonState = digitalRead(buttonPin);
  if (buttonState == HIGH) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }
}`,
        hint: 'Use digitalRead() to read the button and an if-else to control the LED.',
      },
      {
        id: 519,
        text: 'Write a traffic light program using: Red LED on pin 2, Yellow LED on pin 8, Green LED on pin 13. Red = 5s, Yellow = 2s, Green = 5s, then Yellow again for 2s before repeating.',
        marks: '5 pts',
        type: 'code',
        answer: 'In loop(), turn on one LED at a time with appropriate delays: red 5s, yellow 2s, green 5s, yellow 2s. Turn off the previous LED before turning on the next.',
        answerCode: `int red = 2;
int yellow = 8;
int green = 13;

void setup() {
  pinMode(red, OUTPUT);
  pinMode(yellow, OUTPUT);
  pinMode(green, OUTPUT);
}

void loop() {
  // Red - stop
  digitalWrite(red, HIGH);
  digitalWrite(yellow, LOW);
  digitalWrite(green, LOW);
  delay(5000);

  // Yellow - ready
  digitalWrite(red, LOW);
  digitalWrite(yellow, HIGH);
  digitalWrite(green, LOW);
  delay(2000);

  // Green - go
  digitalWrite(red, LOW);
  digitalWrite(yellow, LOW);
  digitalWrite(green, HIGH);
  delay(5000);

  // Yellow - slow down
  digitalWrite(red, LOW);
  digitalWrite(yellow, HIGH);
  digitalWrite(green, LOW);
  delay(2000);
}`,
        hint: 'Set all 3 pins as OUTPUT. In loop(), control one LED at a time while turning others off.',
      },
      {
        id: 520,
        text: 'A sensor is connected to analog pin A0 and an LED is connected to pin 13. Write Arduino code so that if the sensor value is greater than 500, the LED turns on. Otherwise, it turns off.',
        marks: '4 pts',
        type: 'code',
        answer: 'Use analogRead() to read the sensor on A0. Compare with 500 using an if-else. Add a small delay to avoid rapid toggling.',
        answerCode: `int sensorPin = A0;
int ledPin = 13;
int sensorValue = 0;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  sensorValue = analogRead(sensorPin);
  if (sensorValue > 500) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }
  delay(200);
}`,
        hint: 'Use analogRead(A0) to read the sensor and compare with 500.',
      },
      // ─── Additional Code Questions ───
      {
        id: 521,
        text: 'Write Arduino code to blink two LEDs alternately: LED1 on pin 12 and LED2 on pin 13. When LED1 is on, LED2 is off, and vice versa. Switch every 500ms.',
        marks: '4 pts',
        type: 'code',
        answer: 'In loop(), set LED1 HIGH and LED2 LOW, delay, then swap them. This creates an alternating blink pattern.',
        answerCode: `int led1 = 12;
int led2 = 13;

void setup() {
  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
}

void loop() {
  digitalWrite(led1, HIGH);
  digitalWrite(led2, LOW);
  delay(500);
  digitalWrite(led1, LOW);
  digitalWrite(led2, HIGH);
  delay(500);
}`,
        hint: 'When one LED is HIGH, the other should be LOW.',
      },
      {
        id: 522,
        text: 'Write Arduino code that reads a potentiometer on A0 and uses analogWrite() on pin 9 to control the brightness of an LED. The LED brightness should change as the potentiometer is rotated.',
        marks: '5 pts',
        type: 'code',
        answer: 'Read analog value (0-1023) from A0, map it to PWM range (0-255) using map(), then write to pin 9 with analogWrite().',
        answerCode: `int potPin = A0;
int ledPin = 9;
int potValue = 0;
int brightness = 0;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  potValue = analogRead(potPin);
  brightness = map(potValue, 0, 1023, 0, 255);
  analogWrite(ledPin, brightness);
  delay(10);
}`,
        hint: 'Use map() to convert the analog range (0-1023) to PWM range (0-255). analogWrite() uses PWM pins.',
      },
      {
        id: 523,
        text: 'Write Arduino code to control a servo motor on pin 9. The servo should sweep from 0 to 180 degrees and back, in steps of 10 degrees, with a 50ms delay between steps.',
        marks: '5 pts',
        type: 'code',
        answer: 'Use the Servo library. In loop(), use a for loop to go from 0 to 180 in steps of 10, then another for loop to go from 180 back to 0.',
        answerCode: `#include <Servo.h>

Servo myServo;

void setup() {
  myServo.attach(9);
}

void loop() {
  for (int pos = 0; pos <= 180; pos += 10) {
    myServo.write(pos);
    delay(50);
  }
  for (int pos = 180; pos >= 0; pos -= 10) {
    myServo.write(pos);
    delay(50);
  }
}`,
        hint: 'Include the Servo library, attach the servo in setup(), use for loops with write() in loop().',
      },
      {
        id: 524,
        text: 'Write Arduino code that reads a temperature sensor on A0. If the temperature value (analog reading) is above 600, turn on a fan (motor on pin 8) and a red LED (pin 13). If below 400, turn them off. Between 400-600, turn on only the LED.',
        marks: '5 pts',
        type: 'code',
        answer: 'Read the sensor value, then use nested if-else-if to handle three ranges: above 600 (fan + LED on), 400-600 (LED only), below 400 (both off).',
        answerCode: `int tempPin = A0;
int fanPin = 8;
int ledPin = 13;
int tempValue = 0;

void setup() {
  pinMode(fanPin, OUTPUT);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  tempValue = analogRead(tempPin);

  if (tempValue > 600) {
    digitalWrite(fanPin, HIGH);
    digitalWrite(ledPin, HIGH);
  } else if (tempValue >= 400) {
    digitalWrite(fanPin, LOW);
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(fanPin, LOW);
    digitalWrite(ledPin, LOW);
  }
  delay(200);
}`,
        hint: 'Use if-else-if for three conditions: >600, 400-600, <400.',
      },
      // ─── Trace Questions ───
      {
        id: 525,
        text: 'What is the output/behavior of the following Arduino code?',
        marks: '3 pts',
        type: 'trace',
        codeBlock: `int led = 12;

void setup() {
  pinMode(led, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(led, HIGH);
  delay(500);
  digitalWrite(led, LOW);
  delay(500);
  Serial.println("Blink");
}`,
        answer: 'The LED on pin 12 blinks every 1 second (500ms on, 500ms off), and "Blink" is printed to the Serial Monitor each time the loop completes one full on-off cycle.',
      },
      {
        id: 526,
        text: 'What is the output/behavior of the following Arduino code?',
        marks: '3 pts',
        type: 'trace',
        codeBlock: `int count = 0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  count++;
  Serial.println(count);
  delay(1000);
}`,
        answer: 'The program prints incrementing numbers to the Serial Monitor: 1, 2, 3, 4, ... each on a new line, with a 1-second delay between each number. The count variable increases by 1 each loop iteration.',
      },
      {
        id: 527,
        text: 'What is the output/behavior of the following Arduino code?',
        marks: '3 pts',
        type: 'trace',
        codeBlock: `int x = 5;

void setup() {
  Serial.begin(9600);
}

void loop() {
  if (x > 3) {
    Serial.println("High");
  } else {
    Serial.println("Low");
  }
  delay(1000);
}`,
        answer: 'Since x is 5 and 5 > 3 is always true, the program will print "High" repeatedly to the Serial Monitor every 1 second. The "Low" branch will never execute because x never changes.',
      },
    ],
  },
  {
    id: 8,
    title: 'IoT Communication & Networking',
    marks: '50 pts',
    icon: '📡',
    questions: [
      // ─── MCQ from Tutorial 8 (Q1-Q25) ───
      {
        id: 601,
        text: 'In IoT systems, which communication path is most common for sending sensor data to a cloud dashboard?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Sensor → Cloud directly (always)', isCorrect: false },
          { letter: 'B', text: 'Sensor → Gateway/Router → Internet/Cloud', isCorrect: true },
          { letter: 'C', text: 'Cloud → Sensor → Gateway', isCorrect: false },
          { letter: 'D', text: 'Sensor → Actuator → Cloud', isCorrect: false },
        ],
        answer: 'The most common IoT communication path is Sensor → Gateway/Router → Internet/Cloud. Sensors typically send data to a local gateway, which then forwards it to cloud services over the internet.',
      },
      {
        id: 602,
        text: 'Which of the following is a wired communication technology?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Wi-Fi', isCorrect: false },
          { letter: 'B', text: 'Bluetooth', isCorrect: false },
          { letter: 'C', text: 'Ethernet', isCorrect: true },
          { letter: 'D', text: 'LTE', isCorrect: false },
        ],
        answer: 'Ethernet is a wired communication technology that uses physical cables. Wi-Fi, Bluetooth, and LTE are all wireless technologies that use radio waves.',
      },
      {
        id: 603,
        text: 'Which wireless option is generally best for short range and very low power devices?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Wi-Fi', isCorrect: false },
          { letter: 'B', text: 'BLE (Bluetooth Low Energy)', isCorrect: true },
          { letter: 'C', text: '4G', isCorrect: false },
          { letter: 'D', text: 'Ethernet', isCorrect: false },
        ],
        answer: 'BLE (Bluetooth Low Energy) is designed for short-range communication with very low power consumption, making it ideal for wearables, sensors, and other battery-powered IoT devices.',
      },
      {
        id: 604,
        text: 'Which tradeoff describes how far a connection can reach?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Bandwidth', isCorrect: false },
          { letter: 'B', text: 'Range', isCorrect: true },
          { letter: 'C', text: 'Topology', isCorrect: false },
          { letter: 'D', text: 'Cost', isCorrect: false },
        ],
        answer: 'Range describes how far a communication signal can reach — from a few meters (BLE) to kilometers (LPWAN). The other options describe different aspects: bandwidth = data rate, topology = connection arrangement, cost = expense.',
      },
      {
        id: 605,
        text: 'A battery sensor sends 20 bytes every 10 minutes for 2 years. Which tradeoff is most critical?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Maximum bandwidth', isCorrect: false },
          { letter: 'B', text: 'Low power consumption', isCorrect: true },
          { letter: 'C', text: 'Highest cost option', isCorrect: false },
          { letter: 'D', text: 'Highest latency', isCorrect: false },
        ],
        answer: 'For a battery-powered sensor that must run for 2 years, low power consumption is the most critical tradeoff. The data rate is very small (20 bytes every 10 minutes), so bandwidth is not a concern.',
      },
      {
        id: 606,
        text: 'In a star topology, devices primarily connect to:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Each other directly', isCorrect: false },
          { letter: 'B', text: 'A central node (router/gateway)', isCorrect: true },
          { letter: 'C', text: 'Random nodes only', isCorrect: false },
          { letter: 'D', text: 'Satellites', isCorrect: false },
        ],
        answer: 'In a star topology, all devices connect to a single central node (router/gateway). This makes management easy but creates a single point of failure — if the central node goes down, all devices lose connectivity.',
      },
      {
        id: 607,
        text: 'A mesh topology is best described as one where:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Only one device can transmit', isCorrect: false },
          { letter: 'B', text: 'Devices can relay messages for other devices', isCorrect: true },
          { letter: 'C', text: 'All devices must connect by cable', isCorrect: false },
          { letter: 'D', text: 'Only the gateway can send messages', isCorrect: false },
        ],
        answer: 'In a mesh topology, devices can relay messages for each other, extending the network range and providing redundancy. If one node fails, messages can be routed through alternative paths.',
      },
      {
        id: 608,
        text: 'Which address is mainly used for delivering data inside a local network?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'IP address', isCorrect: false },
          { letter: 'B', text: 'DNS name', isCorrect: false },
          { letter: 'C', text: 'MAC address', isCorrect: true },
          { letter: 'D', text: 'Port number', isCorrect: false },
        ],
        answer: 'MAC addresses are used for local delivery within the same network segment. Switches and access points use MAC addresses to forward frames to the correct device. IP addresses route data between different networks.',
      },
      {
        id: 609,
        text: 'Which address is mainly used to route data across different networks (internet)?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'MAC address', isCorrect: false },
          { letter: 'B', text: 'IP address', isCorrect: true },
          { letter: 'C', text: 'Port number', isCorrect: false },
          { letter: 'D', text: 'SSID', isCorrect: false },
        ],
        answer: 'IP addresses are used by routers to deliver packets across different networks (the internet). MAC addresses are for local delivery, port numbers identify services, and SSID is a Wi-Fi network name.',
      },
      {
        id: 610,
        text: 'What is the primary function of DHCP?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Encrypt network traffic', isCorrect: false },
          { letter: 'B', text: 'Assign IP configuration automatically', isCorrect: true },
          { letter: 'C', text: 'Convert names into IP addresses', isCorrect: false },
          { letter: 'D', text: 'Decide whether to use TCP or UDP', isCorrect: false },
        ],
        answer: 'DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses, subnet masks, default gateways, and DNS server addresses to devices on a network. This eliminates the need for manual IP configuration.',
      },
      {
        id: 611,
        text: 'What is the primary function of DNS?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Give a device its MAC address', isCorrect: false },
          { letter: 'B', text: 'Convert a domain name to an IP address', isCorrect: true },
          { letter: 'C', text: 'Reduce Wi-Fi power consumption', isCorrect: false },
          { letter: 'D', text: 'Replace the need for routing', isCorrect: false },
        ],
        answer: 'DNS (Domain Name System) translates human-readable domain names (like iot.example.com) into IP addresses that computers use for routing. It acts like the internet phonebook.',
      },
      {
        id: 612,
        text: 'Why are port numbers needed in networking?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'To identify the device manufacturer', isCorrect: false },
          { letter: 'B', text: 'To identify the specific service/application on a device', isCorrect: true },
          { letter: 'C', text: 'To increase wireless range', isCorrect: false },
          { letter: 'D', text: 'To replace IP addresses', isCorrect: false },
        ],
        answer: 'Port numbers identify which service or application should receive the data on a device. For example, port 80 for HTTP, port 443 for HTTPS, port 1883 for MQTT. Think: IP = building address, Port = apartment number.',
      },
      {
        id: 613,
        text: 'Which statement about TCP is correct?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'TCP provides best speed with no overhead', isCorrect: false },
          { letter: 'B', text: 'TCP provides reliable, ordered delivery', isCorrect: true },
          { letter: 'C', text: 'TCP never retransmits lost data', isCorrect: false },
          { letter: 'D', text: 'TCP does not require a connection', isCorrect: false },
        ],
        answer: 'TCP (Transmission Control Protocol) provides reliable, ordered delivery of data. It establishes a connection, confirms delivery, retransmits lost packets, and maintains correct ordering — but this adds overhead.',
      },
      {
        id: 614,
        text: 'Which statement about UDP is correct?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'UDP guarantees delivery and ordering', isCorrect: false },
          { letter: 'B', text: 'UDP always retransmits lost packets', isCorrect: false },
          { letter: 'C', text: 'UDP is simpler and often has lower overhead', isCorrect: true },
          { letter: 'D', text: 'UDP requires a connection setup (handshake)', isCorrect: false },
        ],
        answer: 'UDP (User Datagram Protocol) is a simple, connectionless protocol with lower overhead than TCP. It does not guarantee delivery, ordering, or retransmission — making it faster but less reliable.',
      },
      {
        id: 615,
        text: 'Which is the best choice for OTA firmware updates in most IoT systems?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'UDP, because it is fast', isCorrect: false },
          { letter: 'B', text: 'TCP, because reliability is important', isCorrect: true },
          { letter: 'C', text: 'Bluetooth only, because it is wireless', isCorrect: false },
          { letter: 'D', text: 'DNS, because it uses names', isCorrect: false },
        ],
        answer: 'OTA (Over-The-Air) firmware updates require every byte to arrive correctly — a corrupted update could brick the device. TCP\'s reliable, ordered delivery makes it the right choice for this critical operation.',
      },
      {
        id: 616,
        text: 'Which is often better for real-time sensor updates where the latest value matters more than perfect delivery?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'TCP', isCorrect: false },
          { letter: 'B', text: 'UDP', isCorrect: true },
          { letter: 'C', text: 'DHCP', isCorrect: false },
          { letter: 'D', text: 'DNS', isCorrect: false },
        ],
        answer: 'UDP is better for real-time sensor updates because: (1) you care about the latest value, not old retransmitted ones, (2) occasional lost packets are acceptable, (3) lower latency is more important than guaranteed delivery.',
      },
      {
        id: 617,
        text: 'The main purpose of an IoT gateway is to:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Replace the sensors', isCorrect: false },
          { letter: 'B', text: 'Connect local device networks to IP/internet networks', isCorrect: true },
          { letter: 'C', text: 'Remove the need for IP addresses', isCorrect: false },
          { letter: 'D', text: 'Stop devices from communicating', isCorrect: false },
        ],
        answer: 'An IoT gateway bridges local device networks (BLE, ZigBee, LPWAN) to the internet/cloud. It collects data from many devices, translates protocols (non-IP to IP), and can handle security policies.',
      },
      {
        id: 618,
        text: 'An edge node is mainly used to:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Only store data in the cloud', isCorrect: false },
          { letter: 'B', text: 'Process/filter data near the devices', isCorrect: true },
          { letter: 'C', text: 'Increase MAC address length', isCorrect: false },
          { letter: 'D', text: 'Convert TCP into UDP', isCorrect: false },
        ],
        answer: 'An edge node processes data near the devices (at the edge of the network) rather than sending everything to the cloud. It filters/aggregates data, responds quickly without cloud latency, and can keep working during internet outages.',
      },
      {
        id: 619,
        text: 'Which combination is correct?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'IP = local hardware identity, MAC = internet routing', isCorrect: false },
          { letter: 'B', text: 'MAC = local hardware identity, IP = internet routing', isCorrect: true },
          { letter: 'C', text: 'Port = device identity, IP = application identity', isCorrect: false },
          { letter: 'D', text: 'DNS = hardware identity, DHCP = encryption', isCorrect: false },
        ],
        answer: 'MAC address is the device\'s hardware identity used for local delivery, while IP address is the network location used for routing between networks. The correct pairing: MAC = local, IP = internet routing.',
      },
      {
        id: 620,
        text: 'If DNS is not working, an IoT device may fail to:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Read a sensor locally', isCorrect: false },
          { letter: 'B', text: 'Reach a cloud server using a hostname (domain name)', isCorrect: true },
          { letter: 'C', text: 'Turn on an LED', isCorrect: false },
          { letter: 'D', text: 'Store data in memory', isCorrect: false },
        ],
        answer: 'DNS converts domain names to IP addresses. If DNS fails, the device cannot resolve hostnames like iot.example.com to IP addresses, preventing cloud communication by name. Local operations (sensors, LEDs) still work.',
      },
      {
        id: 621,
        text: 'Which connection is usually associated with high bandwidth but higher power consumption in IoT?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Wi-Fi', isCorrect: true },
          { letter: 'B', text: 'LPWAN', isCorrect: false },
          { letter: 'C', text: 'BLE', isCorrect: false },
          { letter: 'D', text: 'ZigBee', isCorrect: false },
        ],
        answer: 'Wi-Fi provides high bandwidth (good for video, large data) but consumes significantly more power than BLE, LPWAN, or ZigBee. This makes Wi-Fi less suitable for battery-powered IoT devices that need to run for months.',
      },
      {
        id: 622,
        text: 'Which option best matches: very long range + very low power + small messages?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Wi-Fi', isCorrect: false },
          { letter: 'B', text: 'Ethernet', isCorrect: false },
          { letter: 'C', text: 'LPWAN', isCorrect: true },
          { letter: 'D', text: 'HDMI', isCorrect: false },
        ],
        answer: 'LPWAN (Low-Power Wide-Area Network) technologies like LoRa and Sigfox are designed for very long range (kilometers), very low power consumption (years on battery), and small message sizes — perfect for remote sensors.',
      },
      {
        id: 623,
        text: 'Which of the following is a strong reason to use a gateway in IoT?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'To make every device a server', isCorrect: false },
          { letter: 'B', text: 'To translate between different protocols/technologies', isCorrect: true },
          { letter: 'C', text: 'To remove all network delays', isCorrect: false },
          { letter: 'D', text: 'To avoid using sensors', isCorrect: false },
        ],
        answer: 'A key function of IoT gateways is protocol translation — converting between local device protocols (BLE, ZigBee, etc.) and internet protocols (TCP/IP). This allows non-IP devices to communicate with cloud services.',
      },
      {
        id: 624,
        text: 'Which situation most strongly suggests using wired communication?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Moving wearable device', isCorrect: false },
          { letter: 'B', text: 'High interference environment where signals are unstable', isCorrect: true },
          { letter: 'C', text: 'Device must be portable and battery-powered', isCorrect: false },
          { letter: 'D', text: 'Sensor located far from any building', isCorrect: false },
        ],
        answer: 'Wired communication is preferred in high interference environments because physical cables are not affected by radio interference, walls, or other wireless signals. Wearable, portable, and remote devices typically need wireless.',
      },
      {
        id: 625,
        text: 'When a device has an IP address and wants to send data to the internet, it typically sends traffic first to:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'MAC address table', isCorrect: false },
          { letter: 'B', text: 'Default gateway', isCorrect: true },
          { letter: 'C', text: 'DNS root server', isCorrect: false },
          { letter: 'D', text: 'Bluetooth pairing list', isCorrect: false },
        ],
        answer: 'The default gateway is the router that connects the local network to the internet. When a device needs to send data outside its local network, it forwards the traffic to the default gateway for routing to the destination.',
      },
      // ─── Additional MCQ from Lecture 7 content ───
      {
        id: 626,
        text: 'Which IoT wired communication standard is commonly used in industrial environments?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Bluetooth', isCorrect: false },
          { letter: 'B', text: 'RS-485', isCorrect: true },
          { letter: 'C', text: 'Wi-Fi', isCorrect: false },
          { letter: 'D', text: 'LPWAN', isCorrect: false },
        ],
        answer: 'RS-485 is a wired communication standard commonly used in industrial IoT environments for its noise immunity, long cable runs (up to 1200m), and multi-device support on a single bus.',
      },
      {
        id: 627,
        text: 'Which IoT wired communication standard is commonly used in automotive applications?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'CAN bus', isCorrect: true },
          { letter: 'B', text: 'Ethernet', isCorrect: false },
          { letter: 'C', text: 'BLE', isCorrect: false },
          { letter: 'D', text: 'ZigBee', isCorrect: false },
        ],
        answer: 'CAN (Controller Area Network) bus is the standard wired communication protocol used in automotive applications, allowing microcontrollers and devices in a vehicle to communicate without a host computer.',
      },
      {
        id: 628,
        text: 'Which topology is best for connecting many IoT sensors to one gateway?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Ring topology', isCorrect: false },
          { letter: 'B', text: 'Star topology', isCorrect: true },
          { letter: 'C', text: 'Bus topology', isCorrect: false },
          { letter: 'D', text: 'Point-to-Point', isCorrect: false },
        ],
        answer: 'Star topology is ideal for connecting many IoT sensors to a single gateway because: it is simple to manage, easy to add/remove devices, and the central gateway can control all communication.',
      },
      {
        id: 629,
        text: 'Which topology provides the highest redundancy (many backup paths)?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Star topology', isCorrect: false },
          { letter: 'B', text: 'Bus topology', isCorrect: false },
          { letter: 'C', text: 'Mesh topology', isCorrect: true },
          { letter: 'D', text: 'Ring topology', isCorrect: false },
        ],
        answer: 'Full mesh topology provides the highest redundancy because every node connects to every other node. If any node or link fails, data can be rerouted through alternative paths. However, it is complex and expensive to implement.',
      },
      {
        id: 630,
        text: 'In the 3-level networking model for IoT, which level decides between TCP and UDP?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Link/Local level', isCorrect: false },
          { letter: 'B', text: 'Network/Internet level', isCorrect: false },
          { letter: 'C', text: 'Transport level', isCorrect: true },
          { letter: 'D', text: 'Application level', isCorrect: false },
        ],
        answer: 'The Transport level decides how data is delivered — using TCP for reliable delivery or UDP for fast, low-overhead delivery. The Link level handles local delivery (MAC), and the Network level handles routing (IP).',
      },
      {
        id: 631,
        text: 'What does DHCP typically provide to a device? (Select the most complete answer)',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Only an IP address', isCorrect: false },
          { letter: 'B', text: 'IP address, subnet mask, default gateway, and DNS server address', isCorrect: true },
          { letter: 'C', text: 'MAC address and port number', isCorrect: false },
          { letter: 'D', text: 'Encryption keys and firewall rules', isCorrect: false },
        ],
        answer: 'DHCP provides: IP address (device\'s network identity), subnet mask (which devices are local), default gateway (where to send internet traffic), and DNS server address (for name resolution). This complete configuration allows a device to communicate on the network.',
      },
      {
        id: 632,
        text: 'Why is DNS important for IoT devices connecting to cloud services?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'It provides power to the devices', isCorrect: false },
          { letter: 'B', text: 'Cloud servers can change IPs, but the domain name stays the same', isCorrect: true },
          { letter: 'C', text: 'It replaces the need for internet connectivity', isCorrect: false },
          { letter: 'D', text: 'It encrypts all network traffic', isCorrect: false },
        ],
        answer: 'Cloud servers may change their IP addresses (due to scaling, maintenance, or load balancing), but the domain name remains constant. DNS allows IoT devices to always reach the correct server by resolving the hostname, even when the underlying IP changes.',
      },
      {
        id: 633,
        text: 'An edge node can continue making local decisions even when:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'The sensors are disconnected', isCorrect: false },
          { letter: 'B', text: 'The internet connection is down', isCorrect: true },
          { letter: 'C', text: 'The power supply fails', isCorrect: false },
          { letter: 'D', text: 'All devices are removed', isCorrect: false },
        ],
        answer: 'A key advantage of edge computing is that it can continue to process data and make local decisions even when the internet connection is unavailable. This is critical for IoT systems that need real-time responses.',
      },
      // ─── Fill Questions: Network Topologies ───
      {
        id: 634,
        text: 'Fill in the correct network topology names and concepts:',
        marks: '5 pts',
        type: 'fill',
        fillItems: [
          { label: 'Topology where one device talks directly to one other device', answer: 'Point-to-Point' },
          { label: 'Topology where many devices connect to a central router/gateway', answer: 'Star' },
          { label: 'Topology where devices can relay messages for each other', answer: 'Mesh' },
          { label: 'Topology where devices connect in a circular chain', answer: 'Ring' },
          { label: 'Topology that combines more than one topology type', answer: 'Hybrid' },
        ],
        answer: 'The main network topologies are: Point-to-Point (1-to-1), Star (central hub), Mesh (multi-path relay), Ring (circular chain), Bus (shared single cable), Tree (hierarchical), and Hybrid (combination).',
      },
      {
        id: 635,
        text: 'Fill in the correct networking terms:',
        marks: '5 pts',
        type: 'fill',
        fillItems: [
          { label: 'Protocol that assigns IP addresses automatically', answer: 'DHCP' },
          { label: 'Protocol that converts domain names to IP addresses', answer: 'DNS' },
          { label: 'Protocol that provides reliable, ordered delivery', answer: 'TCP' },
          { label: 'Protocol that is fast with low overhead but no delivery guarantee', answer: 'UDP' },
          { label: 'Number that identifies a specific service on a device', answer: 'Port number' },
        ],
        answer: 'DHCP auto-assigns IP configuration, DNS resolves domain names, TCP provides reliable transport, UDP provides fast lightweight transport, and port numbers identify specific services on a device.',
      },
      // ─── Additional conceptual MCQ ───
      {
        id: 636,
        text: 'What is the main advantage of wireless communication over wired in IoT?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Always more reliable than wired', isCorrect: false },
          { letter: 'B', text: 'Easier installation and supports mobile/remote devices', isCorrect: true },
          { letter: 'C', text: 'Always faster data transfer', isCorrect: false },
          { letter: 'D', text: 'No power consumption at all', isCorrect: false },
        ],
        answer: 'Wireless communication\'s main advantages are easier installation (no cables to run), support for mobile and remote devices, and flexibility in device placement. However, it trades off against interference, security, and power consumption concerns.',
      },
      {
        id: 637,
        text: 'Which IoT communication technology would you choose for a smart watch that needs to sync data with a phone?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Ethernet', isCorrect: false },
          { letter: 'B', text: 'LPWAN', isCorrect: false },
          { letter: 'C', text: 'BLE (Bluetooth Low Energy)', isCorrect: true },
          { letter: 'D', text: '4G Cellular', isCorrect: false },
        ],
        answer: 'BLE is ideal for a smart watch: short range (watch is near the phone), very low power (small battery), and sufficient bandwidth for health/activity data. Ethernet needs cables, LPWAN is for long-range low-data, and 4G is overkill for local sync.',
      },
      {
        id: 638,
        text: 'Which IoT communication technology would you choose for a soil moisture sensor in a remote farm, sending data once per hour?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Wi-Fi', isCorrect: false },
          { letter: 'B', text: 'BLE', isCorrect: false },
          { letter: 'C', text: 'LPWAN (e.g., LoRa)', isCorrect: true },
          { letter: 'D', text: 'Ethernet', isCorrect: false },
        ],
        answer: 'LPWAN (like LoRa) is ideal for remote farm sensors: very long range (kilometers), very low power (battery lasts years), and tiny data messages (once per hour is minimal). Wi-Fi and BLE are too short-range, and Ethernet needs cables.',
      },
      {
        id: 639,
        text: 'What happens at the Link/Local level of IoT networking?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Data is routed across the internet using IP', isCorrect: false },
          { letter: 'B', text: 'Transport protocol (TCP/UDP) is chosen', isCorrect: false },
          { letter: 'C', text: 'Data is delivered within the same local network using MAC addresses', isCorrect: true },
          { letter: 'D', text: 'Domain names are resolved to IP addresses', isCorrect: false },
        ],
        answer: 'At the Link/Local level, data is delivered within the same local network using MAC addresses and switches. This is the lowest level — IP routing happens at the Network level, TCP/UDP at the Transport level, and DNS at the Application level.',
      },
      {
        id: 640,
        text: 'Which of the following is a disadvantage of a star topology?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Too many cables required between all devices', isCorrect: false },
          { letter: 'B', text: 'If the central node fails, all devices lose connectivity', isCorrect: true },
          { letter: 'C', text: 'Devices cannot join or leave the network easily', isCorrect: false },
          { letter: 'D', text: 'It requires the most complex routing algorithms', isCorrect: false },
        ],
        answer: 'The main disadvantage of star topology is the single point of failure: if the central hub/gateway goes down, all connected devices lose connectivity. Mesh topology solves this with redundant paths but adds complexity.',
      },
      // ─── Code Question: IoT Networking Concept ───
      {
        id: 641,
        text: 'Write Arduino code that connects to WiFi, reads a sensor value from A0, and sends it as an HTTP GET request to a server every 5 seconds. Use the WiFi and WiFiClient libraries. (Assume ESP32 board)',
        marks: '5 pts',
        type: 'code',
        answer: 'In setup(), connect to WiFi using WiFi.begin(). In loop(), read analog value, create an HTTP GET request string, connect to the server, send the request, and wait 5 seconds.',
        answerCode: `#include <WiFi.h>
#include <WiFiClient.h>

const char* ssid = "YourWiFiSSID";
const char* password = "YourPassword";
const char* server = "example.com";
const int port = 80;

WiFiClient client;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected!");
}

void loop() {
  int sensorValue = analogRead(A0);

  if (client.connect(server, port)) {
    client.print("GET /update?value=");
    client.print(sensorValue);
    client.println(" HTTP/1.1");
    client.print("Host: ");
    client.println(server);
    client.println("Connection: close");
    client.println();
    client.stop();
    Serial.print("Sent: ");
    Serial.println(sensorValue);
  } else {
    Serial.println("Connection failed");
  }
  delay(5000);
}`,
        hint: 'Use WiFi.begin() for connection, WiFiClient to connect and send HTTP GET with sensor value in the URL.',
      },
      {
        id: 642,
        text: 'Write Arduino code that reads a joystick (VRX on A0, VRY on A1, SW on pin 4) and prints the X, Y values and button state to the Serial Monitor every 200ms.',
        marks: '4 pts',
        type: 'code',
        answer: 'In setup(), initialize Serial and set SW pin as INPUT_PULLUP. In loop(), read both analog values and the digital button, then print them.',
        answerCode: `int vrxPin = A0;
int vryPin = A1;
int swPin = 4;

void setup() {
  Serial.begin(9600);
  pinMode(swPin, INPUT_PULLUP);
}

void loop() {
  int x = analogRead(vrxPin);
  int y = analogRead(vryPin);
  int button = digitalRead(swPin);

  Serial.print("X: ");
  Serial.print(x);
  Serial.print(" | Y: ");
  Serial.print(y);
  Serial.print(" | Button: ");
  Serial.println(button == LOW ? "PRESSED" : "Released");

  delay(200);
}`,
        hint: 'Use analogRead() for VRX/VRY and digitalRead() with INPUT_PULLUP for SW.',
      },
      {
        id: 643,
        text: 'Write Arduino code to control a DC motor using L298N: ENA on pin 9 (PWM), IN1 on pin 8, IN2 on pin 7. The motor should gradually speed up from 0 to full speed over 3 seconds, then reverse direction and do the same.',
        marks: '5 pts',
        type: 'code',
        answer: 'Set pin modes. Use two phases: forward (IN1=HIGH, IN2=LOW) and reverse (IN1=LOW, IN2=HIGH). In each phase, ramp up analogWrite on ENA from 0 to 255.',
        answerCode: `int ena = 9;
int in1 = 8;
int in2 = 7;

void setup() {
  pinMode(ena, OUTPUT);
  pinMode(in1, OUTPUT);
  pinMode(in2, OUTPUT);
}

void loop() {
  // Forward direction
  digitalWrite(in1, HIGH);
  digitalWrite(in2, LOW);

  // Speed up forward
  for (int speed = 0; speed <= 255; speed++) {
    analogWrite(ena, speed);
    delay(12); // ~3 seconds total (255 * 12ms ≈ 3060ms)
  }

  delay(500);

  // Reverse direction
  digitalWrite(in1, LOW);
  digitalWrite(in2, HIGH);

  // Speed up reverse
  for (int speed = 0; speed <= 255; speed++) {
    analogWrite(ena, speed);
    delay(12);
  }

  delay(500);
}`,
        hint: 'Use analogWrite() on ENA for PWM speed control, and digitalWrite() on IN1/IN2 for direction.',
      },
    ],
  },
]
