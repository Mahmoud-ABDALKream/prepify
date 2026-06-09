'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
    title: 'Multiple Choice Questions (MCQs)',
    marks: '15 pts',
    icon: '📋',
    questions: [
      {
        id: 1,
        text: 'In Public Key Encryption, which key is generated locally and never shared?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Private Key', isCorrect: true },
          { letter: 'B', text: 'Public Key', isCorrect: false },
          { letter: 'C', text: 'Hash Function', isCorrect: false },
          { letter: 'D', text: 'Ciphertext', isCorrect: false },
        ],
        answer: 'The Private Key is generated locally and must never be shared. Only the Public Key is shared with others.',
      },
      {
        id: 2,
        text: 'What are the units used to measure Hash Function sizes (input/output)?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Bytes', isCorrect: false },
          { letter: 'B', text: 'Bits', isCorrect: true },
          { letter: 'C', text: 'Kbytes', isCorrect: false },
          { letter: 'D', text: 'Mbytes', isCorrect: false },
        ],
        answer: 'Hash Function input and output sizes are measured in bits (e.g., SHA-256 produces a 256-bit output).',
      },
      {
        id: 3,
        text: 'If User B wants to send a confidential message to User A, which key does B use to encrypt?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Private Key of A', isCorrect: false },
          { letter: 'B', text: 'Public Key of A', isCorrect: true },
          { letter: 'C', text: 'Private Key of B', isCorrect: false },
          { letter: 'D', text: 'Public Key of B', isCorrect: false },
        ],
        answer: 'To send a confidential message to A, B encrypts it with A\'s Public Key. Only A can decrypt it using A\'s Private Key.',
      },
      {
        id: 4,
        text: 'An Encryption Algorithm transforms Plaintext into:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Scrambled message', isCorrect: false },
          { letter: 'B', text: 'Ciphertext', isCorrect: true },
          { letter: 'C', text: 'Digital Signature', isCorrect: false },
          { letter: 'D', text: 'Hash Value', isCorrect: false },
        ],
        answer: 'An encryption algorithm takes plaintext and a key as input and produces ciphertext as output.',
      },
      {
        id: 5,
        text: 'In which technique is the Hash function encrypted using the Sender\'s Private Key?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Message Authentication', isCorrect: false },
          { letter: 'B', text: 'Digital Signature', isCorrect: true },
          { letter: 'C', text: 'Symmetric Encryption', isCorrect: false },
          { letter: 'D', text: 'Decryption', isCorrect: false },
        ],
        answer: 'A Digital Signature is created by encrypting the hash of the message with the sender\'s Private Key, providing authentication and integrity.',
      },
      {
        id: 6,
        text: 'What does Message Authentication ensure?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Sender\'s ID is valid', isCorrect: true },
          { letter: 'B', text: 'Message is encrypted', isCorrect: false },
          { letter: 'C', text: 'Key is public', isCorrect: false },
          { letter: 'D', text: 'Hash is constant', isCorrect: false },
        ],
        answer: 'Message Authentication verifies that the message came from the claimed sender (valid Sender ID) and has not been altered.',
      },
      {
        id: 7,
        text: 'A Certificate links the User\'s Identity to their:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Private Key', isCorrect: false },
          { letter: 'B', text: 'Public Key', isCorrect: true },
          { letter: 'C', text: 'Hash Function', isCorrect: false },
          { letter: 'D', text: 'Firewall', isCorrect: false },
        ],
        answer: 'A certificate binds a user\'s identity (name, organization) to their Public Key, signed by a Certificate Authority (CA).',
      },
      {
        id: 8,
        text: 'Who signs the contents of a Certificate to make it trusted?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Certificate Authority (CA)', isCorrect: true },
          { letter: 'B', text: 'The User', isCorrect: false },
          { letter: 'C', text: 'The Receiver', isCorrect: false },
          { letter: 'D', text: 'Hash Function', isCorrect: false },
        ],
        answer: 'The Certificate Authority (CA) signs the certificate with its Private Key, making it trusted by anyone who trusts the CA.',
      },
      {
        id: 9,
        text: 'In the equation: A -> B: E(K, [M || H(M||S)]), what is S?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Public Key', isCorrect: false },
          { letter: 'B', text: 'Private Key', isCorrect: false },
          { letter: 'C', text: 'Common Secret Value', isCorrect: true },
          { letter: 'D', text: 'Hash Output', isCorrect: false },
        ],
        answer: 'S is the Common Secret Value shared between A and B. It is appended to the message before hashing to provide message authentication.',
      },
      {
        id: 10,
        text: 'Which protocol was developed for Wireless LANs specifications?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'IEEE 802.11', isCorrect: true },
          { letter: 'B', text: 'IEEE 802.3', isCorrect: false },
          { letter: 'C', text: 'IEEE 802.5', isCorrect: false },
          { letter: 'D', text: 'IEEE 802.4', isCorrect: false },
        ],
        answer: 'IEEE 802.11 is the standard for Wireless LANs (Wi-Fi). IEEE 802.3 is Ethernet, 802.5 is Token Ring, 802.4 is Token Bus.',
      },
      {
        id: 11,
        text: 'A set of stations controlled by a single function (AP) is called:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Basic Service Set (BSS)', isCorrect: true },
          { letter: 'B', text: 'Extended Service Set (ESS)', isCorrect: false },
          { letter: 'C', text: 'Access Point', isCorrect: false },
          { letter: 'D', text: 'Distribution System', isCorrect: false },
        ],
        answer: 'A Basic Service Set (BSS) is a group of stations controlled by a single Access Point (AP). An ESS connects multiple BSSs.',
      },
      {
        id: 12,
        text: 'SHA-256 has an input block size of ___ and output size of ___?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Input: 512 bits, Output: 256 bits', isCorrect: true },
          { letter: 'B', text: 'Input: 1024 bits, Output: 256 bits', isCorrect: false },
          { letter: 'C', text: 'Input: 512 bytes, Output: 256 bits', isCorrect: false },
          { letter: 'D', text: 'Input: 256 bits, Output: 512 bits', isCorrect: false },
        ],
        answer: 'SHA-256 processes input in 512-bit blocks and produces a 256-bit hash output.',
      },
      {
        id: 13,
        text: 'User B can decrypt a confidential message intended for him using:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Public Key of B', isCorrect: false },
          { letter: 'B', text: 'Private Key of B', isCorrect: true },
          { letter: 'C', text: 'Public Key of A', isCorrect: false },
          { letter: 'D', text: 'Private Key of A', isCorrect: false },
        ],
        answer: 'A message encrypted with B\'s Public Key can only be decrypted with B\'s Private Key. This ensures confidentiality.',
      },
      {
        id: 14,
        text: 'What does EAP stand for?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Easy Access Protocol', isCorrect: false },
          { letter: 'B', text: 'Extensible Authentication Protocol', isCorrect: true },
          { letter: 'C', text: 'External Access Point', isCorrect: false },
          { letter: 'D', text: 'Encrypted Application Program', isCorrect: false },
        ],
        answer: 'EAP stands for Extensible Authentication Protocol. It is an authentication framework used in wireless networks and point-to-point connections.',
      },
      {
        id: 15,
        text: 'In Asymmetric encryption, it is computationally difficult to determine:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'The Public Key', isCorrect: false },
          { letter: 'B', text: 'The Private Key from Public Key & Ciphertext', isCorrect: true },
          { letter: 'C', text: 'The Hash Value', isCorrect: false },
          { letter: 'D', text: 'The Plaintext length', isCorrect: false },
        ],
        answer: 'In asymmetric encryption, deriving the Private Key from the Public Key and Ciphertext is computationally infeasible. This is the foundation of public-key cryptography security.',
      },
    ],
  },
  {
    id: 2,
    title: 'True or False',
    marks: '8 pts',
    icon: '✅',
    questions: [
      {
        id: 16,
        text: 'Decryption Algorithm accepts Plaintext and Key to produce Ciphertext.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: false },
          { letter: 'F', text: 'False', isCorrect: true },
        ],
        answer: 'False. The Encryption Algorithm accepts Plaintext and Key to produce Ciphertext. The Decryption Algorithm does the reverse — it accepts Ciphertext and Key to produce Plaintext.',
      },
      {
        id: 17,
        text: 'In Public-Key encryption, sender and receiver use different keys.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: true },
          { letter: 'F', text: 'False', isCorrect: false },
        ],
        answer: 'True. In public-key (asymmetric) encryption, the sender uses the receiver\'s Public Key to encrypt, and the receiver uses their own Private Key to decrypt.',
      },
      {
        id: 18,
        text: 'Anyone can read a certificate to see the Owner\'s Private Key.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: false },
          { letter: 'F', text: 'False', isCorrect: true },
        ],
        answer: 'False. A certificate contains the owner\'s Public Key, not the Private Key. The Private Key is never shared or included in any certificate.',
      },
      {
        id: 19,
        text: 'Digital Signature requires Verification to ensure the message was sent by a specific person.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: true },
          { letter: 'F', text: 'False', isCorrect: false },
        ],
        answer: 'True. A digital signature must be verified by the receiver using the sender\'s Public Key to confirm the message\'s authenticity and integrity.',
      },
      {
        id: 20,
        text: 'All Hash Function sizes are measured in Bytes.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: false },
          { letter: 'F', text: 'False', isCorrect: true },
        ],
        answer: 'False. Hash function input and output sizes are measured in bits, not bytes. For example, SHA-256 produces a 256-bit output.',
      },
      {
        id: 21,
        text: 'If User A receives a confidential message from B, A decrypts it with B\'s Private Key.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: false },
          { letter: 'F', text: 'False', isCorrect: true },
        ],
        answer: 'False. User A decrypts the message using A\'s OWN Private Key, not B\'s. The message was encrypted with A\'s Public Key, so only A\'s Private Key can decrypt it.',
      },
      {
        id: 22,
        text: 'In Symmetric Encryption, both parties share the same key.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: true },
          { letter: 'F', text: 'False', isCorrect: false },
        ],
        answer: 'True. In symmetric encryption, both the sender and the receiver use the same shared secret key for both encryption and decryption.',
      },
      {
        id: 23,
        text: 'SHA-512 has an output of 512 bits and input block size of 1024 bits.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: true },
          { letter: 'F', text: 'False', isCorrect: false },
        ],
        answer: 'True. SHA-512 processes input in 1024-bit blocks and produces a 512-bit hash output.',
      },
    ],
  },
  {
    id: 3,
    title: 'Essay Questions & Diagrams',
    marks: '20 pts',
    icon: '📝',
    questions: [
      {
        id: 24,
        text: 'Mention three reasons for Certificate Revocation.',
        marks: '4 pts',
        type: 'code',
        answer: 'Three reasons for certificate revocation:',
        answerCode: '1. User\'s Private Key is compromised (stolen/hacked).\n2. User is no longer certified (e.g., employee left, name changed).\n3. CA\'s Certificate is compromised.',
      },
      {
        id: 25,
        text: 'What are the requirements of a Public Key Certificate?',
        marks: '4 pts',
        type: 'code',
        answer: 'Four requirements of a Public Key Certificate:',
        answerCode: '1. Readability: Any participant can read it to determine name and public key.\n2. Verifiability: Any participant can verify it originated from the CA.\n3. Strict Control: Only the CA can create/update certificates.\n4. Currency: Must be within the validity period.',
      },
      {
        id: 26,
        text: 'Explain the difference between Symmetric and Public-Key Encryption regarding keys.',
        marks: '4 pts',
        type: 'code',
        answer: 'Key differences between Symmetric and Public-Key Encryption:',
        answerCode: 'Symmetric Encryption:\n- Uses ONE shared key for both encryption and decryption.\n- Problem: Key distribution risk — how to share the key securely?\n\nPublic-Key Encryption:\n- Uses TWO keys (Public for encryption, Private for decryption).\n- Advantage: No need to share secret keys over the network.\n- The Public Key can be freely distributed; only the Private Key must be kept secret.',
      },
      {
        id: 27,
        text: 'Draw the Verification Diagram for: A -> B: E(K, [M || E(PRa, H(M))]). Explain the steps at the receiver (B).',
        marks: '4 pts',
        type: 'code',
        answer: 'This equation combines Confidentiality using K and Digital Signature using PRa. Verification steps at receiver B:',
        answerCode: 'Step 1: Decrypt Outer Layer\n  Use Shared Key K to decrypt the whole package.\n  Result: Message (M) + Signature (Sig).\n\nStep 2: Calculate Local Hash\n  Apply Hash function to the extracted message M.\n  Hash_New = H(M)\n\nStep 3: Decrypt Signature\n  Use Sender\'s Public Key (PUa) to decrypt the signature.\n  Hash_Received = D(PUa, Sig)\n\nStep 4: Compare\n  If Hash_New == Hash_Received → Valid (Integrity & Authentication confirmed).\n  Else → Invalid.',
      },
      {
        id: 28,
        text: 'Explain CA Hierarchy Notation and Certification Path. Define Forward and Reverse Certificates for Node K using the example: U<<T>>, T<<I>>, I<<K>>, K<<M>>, M<<L>>, L<<C>>.',
        marks: '4 pts',
        type: 'code',
        answer: 'CA Hierarchy Notation and Certification Path explained:',
        answerCode: 'Notation Rule:\n  Y<<X>> means Certificate of User X issued by Authority Y.\n\nCertification Path:\n  Always goes UP to the common root, then DOWN to the target.\n\nExample Chain: U<<T>>, T<<I>>, I<<K>>, K<<M>>, M<<L>>, L<<C>>\n\nForward Certificates for Node K:\n  Certificates issued TO K by others.\n  Example: I<<K>> (issued by I to K)\n\nReverse Certificates for Node K:\n  Certificates issued BY K to others.\n  Example: K<<I>> (issued by K to I)',
      },
    ],
  },
  {
    id: 4,
    title: 'Tutorial 4 — Wireless LAN Security (MCQ)',
    marks: '20 pts',
    icon: '📡',
    questions: [
      {
        id: 29,
        text: 'IEEE 802.11 was formed to develop specifications for which type of network?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Wired LANs', isCorrect: false },
          { letter: 'B', text: 'Wireless LANs', isCorrect: true },
          { letter: 'C', text: 'Metropolitan Area Networks', isCorrect: false },
          { letter: 'D', text: 'Wide Area Networks', isCorrect: false },
        ],
        answer: 'IEEE 802.11 is the standard developed specifically for Wireless LANs (Wi-Fi) specifications and protocols.',
      },
      {
        id: 30,
        text: 'What does an Access Point (AP) provide in a WLAN?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Encryption keys only', isCorrect: false },
          { letter: 'B', text: 'Access to the distribution system via wireless medium', isCorrect: true },
          { letter: 'C', text: 'Internet routing protocols', isCorrect: false },
          { letter: 'D', text: 'Physical cable connections', isCorrect: false },
        ],
        answer: 'An Access Point (AP) provides access to the distribution system via the wireless medium for linked stations, acting as a bridge between wireless and wired networks.',
      },
      {
        id: 31,
        text: 'A Distribution System interconnects BSSs and integrated LANs to create:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'A Basic Service Set (BSS)', isCorrect: false },
          { letter: 'B', text: 'An Extended Service Set (ESS)', isCorrect: true },
          { letter: 'C', text: 'An Independent BSS (IBSS)', isCorrect: false },
          { letter: 'D', text: 'A Virtual LAN (VLAN)', isCorrect: false },
        ],
        answer: 'The Distribution System interconnects a set of BSSs and integrated LANs to create an Extended Service Set (ESS), enabling seamless roaming.',
      },
      {
        id: 32,
        text: 'In Wired LANs, which of the following is NOT required?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Physical connection', isCorrect: false },
          { letter: 'B', text: 'Authentication', isCorrect: false },
          { letter: 'C', text: 'Radio range proximity', isCorrect: true },
          { letter: 'D', text: 'Privacy measures', isCorrect: false },
        ],
        answer: 'In Wired LANs, stations must be physically connected, authentication is required, and there is a degree of privacy. Radio range proximity is only relevant for Wireless LANs.',
      },
      {
        id: 33,
        text: 'Which of the following best describes the Authentication Phase in WLAN security?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'One-way authentication from server to station', isCorrect: false },
          { letter: 'B', text: 'Mutual authentication between station and authorized servers', isCorrect: true },
          { letter: 'C', text: 'Authentication of the access point only', isCorrect: false },
          { letter: 'D', text: 'Password verification at the router', isCorrect: false },
        ],
        answer: 'The Authentication Phase involves mutual authentication between the station and authorized servers, ensuring both parties verify each other\'s identity before communication.',
      },
      {
        id: 34,
        text: 'A station selects which component to communicate with in a WLAN?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Another station directly (always)', isCorrect: false },
          { letter: 'B', text: 'The distribution system', isCorrect: false },
          { letter: 'C', text: 'An Access Point (AP)', isCorrect: true },
          { letter: 'D', text: 'The authentication server directly', isCorrect: false },
        ],
        answer: 'A station selects an Access Point (AP) to communicate with. The AP then provides connectivity to the distribution system and other network resources.',
      },
      {
        id: 35,
        text: 'Which IEEE standard is specifically designed for Wireless LANs?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'IEEE 802.3', isCorrect: false },
          { letter: 'B', text: 'IEEE 802.11', isCorrect: true },
          { letter: 'C', text: 'IEEE 802.5', isCorrect: false },
          { letter: 'D', text: 'IEEE 802.15', isCorrect: false },
        ],
        answer: 'IEEE 802.11 is the standard specifically developed for Wireless LANs. IEEE 802.3 is Ethernet, 802.5 is Token Ring, and 802.15 is for Bluetooth/WPANs.',
      },
      {
        id: 36,
        text: 'What is a Station (STA) in the context of WLANs?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'A wired router', isCorrect: false },
          { letter: 'B', text: 'Any device that implements IEEE 802.11', isCorrect: true },
          { letter: 'C', text: 'A network cable endpoint', isCorrect: false },
          { letter: 'D', text: 'A satellite receiver', isCorrect: false },
        ],
        answer: 'A Station (STA) in WLANs is any device that has IEEE 802.11 capabilities, such as laptops, smartphones, tablets, or IoT devices.',
      },
      {
        id: 37,
        text: 'What is the primary role of a Distribution System in WLAN architecture?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'To encrypt wireless traffic', isCorrect: false },
          { letter: 'B', text: 'To interconnect BSSs and integrated LANs to form an ESS', isCorrect: true },
          { letter: 'C', text: 'To assign IP addresses', isCorrect: false },
          { letter: 'D', text: 'To authenticate users', isCorrect: false },
        ],
        answer: 'The Distribution System interconnects a set of BSSs and integrated LANs to create an Extended Service Set (ESS), allowing stations to roam seamlessly between APs.',
      },
      {
        id: 38,
        text: 'Which of the following is a key difference between Wired and Wireless LANs?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Wired LANs require authentication but Wireless LANs do not', isCorrect: false },
          { letter: 'B', text: 'Wireless LANs require radio range proximity but Wired LANs do not', isCorrect: true },
          { letter: 'C', text: 'Wired LANs do not provide any degree of privacy', isCorrect: false },
          { letter: 'D', text: 'Wireless LANs require physical cable connections', isCorrect: false },
        ],
        answer: 'A key difference is that Wireless LANs require stations to be within radio range to communicate, while Wired LANs require physical cable connections. Both require authentication.',
      },
      {
        id: 39,
        text: 'Which wireless security protocol replaced WEP with improved encryption?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'WPA', isCorrect: true },
          { letter: 'B', text: 'IPSec', isCorrect: false },
          { letter: 'C', text: 'SSL/TLS', isCorrect: false },
          { letter: 'D', text: 'SSH', isCorrect: false },
        ],
        answer: 'WPA (Wi-Fi Protected Access) replaced WEP with improved encryption (TKIP and later AES) and stronger authentication mechanisms.',
      },
      {
        id: 40,
        text: 'A Basic Service Set (BSS) without an Access Point is called:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Extended Service Set (ESS)', isCorrect: false },
          { letter: 'B', text: 'Independent BSS (IBSS) / Ad hoc network', isCorrect: true },
          { letter: 'C', text: 'Distribution System', isCorrect: false },
          { letter: 'D', text: 'Virtual LAN', isCorrect: false },
        ],
        answer: 'A BSS without an AP is called an Independent BSS (IBSS) or ad hoc network, where stations communicate directly with each other without a central coordinator.',
      },
      {
        id: 41,
        text: 'What does the Key Management Phase generate and distribute?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'IP addresses', isCorrect: false },
          { letter: 'B', text: 'A variety of cryptographic keys', isCorrect: true },
          { letter: 'C', text: 'MAC addresses', isCorrect: false },
          { letter: 'D', text: 'DNS records', isCorrect: false },
        ],
        answer: 'The Key Management Phase is responsible for generating and distributing a variety of cryptographic keys used for encryption, integrity, and authentication in WLAN security.',
      },
      {
        id: 42,
        text: 'In WLAN architecture, an Access Point (AP) acts as:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'A firewall only', isCorrect: false },
          { letter: 'B', text: 'A bridge between wireless stations and the distribution system', isCorrect: true },
          { letter: 'C', text: 'A DHCP server only', isCorrect: false },
          { letter: 'D', text: 'A DNS resolver', isCorrect: false },
        ],
        answer: 'An Access Point (AP) acts as a bridge between wireless stations and the distribution system, providing access to the wired network infrastructure.',
      },
      {
        id: 43,
        text: 'Which of the following is TRUE about Wireless LAN security compared to Wired LAN security?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Wireless LANs have inherent physical security like Wired LANs', isCorrect: false },
          { letter: 'B', text: 'Wireless LANs need additional security measures because signals propagate through the air', isCorrect: true },
          { letter: 'C', text: 'Wired LANs are less secure than Wireless LANs', isCorrect: false },
          { letter: 'D', text: 'Both have identical security requirements', isCorrect: false },
        ],
        answer: 'Wireless LANs need additional security measures because radio signals propagate through the air and can be intercepted by anyone within range, unlike wired signals that require physical access.',
      },
      {
        id: 44,
        text: 'The term "mutual authentication" in WLAN security means:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Only the station authenticates to the server', isCorrect: false },
          { letter: 'B', text: 'Only the server authenticates to the station', isCorrect: false },
          { letter: 'C', text: 'Both the station and the server authenticate each other', isCorrect: true },
          { letter: 'D', text: 'The AP authenticates with the internet', isCorrect: false },
        ],
        answer: 'Mutual authentication means both the station and the authorized server verify each other\'s identity, preventing rogue AP attacks and ensuring both parties are legitimate.',
      },
      {
        id: 45,
        text: 'What is the correct order of WLAN security phases?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Key Management → Authentication → Data Delivery', isCorrect: false },
          { letter: 'B', text: 'Authentication → Key Management → Data Delivery', isCorrect: true },
          { letter: 'C', text: 'Data Delivery → Authentication → Key Management', isCorrect: false },
          { letter: 'D', text: 'Authentication → Data Delivery → Key Management', isCorrect: false },
        ],
        answer: 'The correct order is: Authentication Phase (mutual verification) → Key Management Phase (generate/distribute keys) → Data Delivery (secure communication).',
      },
      {
        id: 46,
        text: 'Which statement about WEP is correct?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'WEP uses AES encryption', isCorrect: false },
          { letter: 'B', text: 'WEP is the most secure wireless protocol', isCorrect: false },
          { letter: 'C', text: 'WEP stands for Wired Equivalent Privacy', isCorrect: true },
          { letter: 'D', text: 'WEP is the same as WPA', isCorrect: false },
        ],
        answer: 'WEP stands for Wired Equivalent Privacy. It was designed to provide security equivalent to that of a wired network, but has been found to have significant vulnerabilities.',
      },
      {
        id: 47,
        text: 'An Extended Service Set (ESS) consists of:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'A single station and a single AP', isCorrect: false },
          { letter: 'B', text: 'Multiple BSSs interconnected via a Distribution System', isCorrect: true },
          { letter: 'C', text: 'Only ad hoc stations without APs', isCorrect: false },
          { letter: 'D', text: 'One BSS with multiple routers', isCorrect: false },
        ],
        answer: 'An ESS consists of multiple BSSs interconnected via a Distribution System along with integrated LANs, enabling seamless roaming across multiple APs.',
      },
      {
        id: 48,
        text: 'Why is authentication particularly important in Wireless LANs?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Because anyone within radio range can potentially access the network', isCorrect: true },
          { letter: 'B', text: 'Because Wired LANs do not need authentication', isCorrect: false },
          { letter: 'C', text: 'Because APs cannot identify stations', isCorrect: false },
          { letter: 'D', text: 'Because wireless signals are invisible', isCorrect: false },
        ],
        answer: 'Authentication is crucial in WLANs because any station within radio range can potentially transmit and receive, making it essential to verify identity before granting network access.',
      },
    ],
  },
  {
    id: 5,
    title: 'Tutorial 4 — Wireless LAN Security (True/False)',
    marks: '15 pts',
    icon: '✅',
    questions: [
      {
        id: 49,
        text: 'A Station in WLANs is any device that implements the IEEE 802.11 standard.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: true },
          { letter: 'F', text: 'False', isCorrect: false },
        ],
        answer: 'True. A station (STA) in WLANs is any device that has IEEE 802.11 capabilities, such as laptops, phones, or IoT devices.',
      },
      {
        id: 50,
        text: 'A Basic Service Set (BSS) is a set of stations controlled by a single coordination function.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: true },
          { letter: 'F', text: 'False', isCorrect: false },
        ],
        answer: 'True. A BSS is a group of stations controlled by a single coordination function, typically an Access Point.',
      },
      {
        id: 51,
        text: 'In Wireless LANs, any station within radio range can transmit and receive.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: true },
          { letter: 'F', text: 'False', isCorrect: false },
        ],
        answer: 'True. In WLANs, any station within radio range of the AP or other stations can transmit and receive signals, which is why authentication is important.',
      },
      {
        id: 52,
        text: 'WPA (Wi-Fi Protected Access) provides better security than WEP (Wired Equivalent Privacy).',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: true },
          { letter: 'F', text: 'False', isCorrect: false },
        ],
        answer: 'True. WPA provides significantly better security than WEP through improved encryption (TKIP/AES) and stronger authentication mechanisms.',
      },
      {
        id: 53,
        text: 'The Key Management Phase involves the generation and distribution of cryptographic keys.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: true },
          { letter: 'F', text: 'False', isCorrect: false },
        ],
        answer: 'True. The Key Management Phase is responsible for generating and distributing a variety of cryptographic keys used for encryption, integrity, and authentication in WLAN security.',
      },
      {
        id: 54,
        text: 'WEP is the most secure wireless encryption protocol available today.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: false },
          { letter: 'F', text: 'False', isCorrect: true },
        ],
        answer: 'False. WEP (Wired Equivalent Privacy) is the oldest and weakest wireless encryption protocol. It has been superseded by WPA, WPA2, and WPA3.',
      },
      {
        id: 55,
        text: 'IEEE 802.11 was developed for both Wired and Wireless LAN specifications.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: false },
          { letter: 'F', text: 'False', isCorrect: true },
        ],
        answer: 'False. IEEE 802.11 was formed specifically to develop protocol and transmission specifications for Wireless LANs only, not Wired LANs.',
      },
      {
        id: 56,
        text: 'An Access Point (AP) provides access to the distribution system via a wired medium.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: false },
          { letter: 'F', text: 'False', isCorrect: true },
        ],
        answer: 'False. An Access Point (AP) provides access to the distribution system via the wireless medium for linked stations, not a wired medium.',
      },
      {
        id: 57,
        text: 'A Distribution System creates a Basic Service Set (BSS) from individual stations.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: false },
          { letter: 'F', text: 'False', isCorrect: true },
        ],
        answer: 'False. A Distribution System interconnects BSSs and integrated LANs to create an Extended Service Set (ESS), not a BSS. A BSS is formed by stations controlled by a single AP.',
      },
      {
        id: 58,
        text: 'In Wired LANs, stations must be physically connected and authentication is required.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: true },
          { letter: 'F', text: 'False', isCorrect: false },
        ],
        answer: 'True. In Wired LANs, stations must be physically connected to the network, authentication is required, and there is a degree of privacy.',
      },
      {
        id: 59,
        text: 'In WLAN security, the Authentication Phase is only one-way (server authenticates the station).',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: false },
          { letter: 'F', text: 'False', isCorrect: true },
        ],
        answer: 'False. The Authentication Phase involves mutual authentication between the station and authorized servers — both parties verify each other\'s identity.',
      },
      {
        id: 60,
        text: 'A station in a WLAN always communicates directly with other stations without using an AP.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: false },
          { letter: 'F', text: 'False', isCorrect: true },
        ],
        answer: 'False. In infrastructure mode, a station selects an Access Point (AP) to communicate with. Only in ad hoc mode (IBSS) do stations communicate directly.',
      },
      {
        id: 61,
        text: 'WPA2 uses AES encryption which is stronger than the TKIP encryption used by original WPA.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: true },
          { letter: 'F', text: 'False', isCorrect: false },
        ],
        answer: 'True. WPA2 uses AES (Advanced Encryption Standard) which is significantly stronger than TKIP (Temporal Key Integrity Protocol) used by the original WPA.',
      },
      {
        id: 62,
        text: 'An ESS (Extended Service Set) allows users to roam between different APs seamlessly.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: true },
          { letter: 'F', text: 'False', isCorrect: false },
        ],
        answer: 'True. An ESS connects multiple BSSs via the Distribution System, allowing stations to roam seamlessly between different APs without losing connectivity.',
      },
      {
        id: 63,
        text: 'The Key Management Phase occurs before the Authentication Phase in WLAN security.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: false },
          { letter: 'F', text: 'False', isCorrect: true },
        ],
        answer: 'False. The correct order is: Authentication Phase first (mutual verification), then Key Management Phase (generate/distribute keys), then Data Delivery.',
      },
    ],
  },
  {
    id: 6,
    title: 'Revision Sheet — Cryptography (MCQ)',
    marks: '18 pts',
    icon: '🔐',
    questions: [
      {
        id: 64,
        text: 'Hash function SHA-384 has an input block size of:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: '1024 bits', isCorrect: true },
          { letter: 'B', text: '512 bits', isCorrect: false },
          { letter: 'C', text: '512 bytes', isCorrect: false },
          { letter: 'D', text: '1024 bytes', isCorrect: false },
        ],
        answer: 'SHA-384 processes input in 1024-bit blocks and produces a 384-bit hash output. The input block size is 1024 bits.',
      },
      {
        id: 65,
        text: 'The decryption algorithm transforms ciphertext into:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Plaintext', isCorrect: true },
          { letter: 'B', text: 'Public Key', isCorrect: false },
          { letter: 'C', text: 'Private Key', isCorrect: false },
          { letter: 'D', text: 'Signature', isCorrect: false },
        ],
        answer: 'The decryption algorithm takes ciphertext and a key as input and produces the original plaintext as output.',
      },
      {
        id: 66,
        text: 'SHA-384 output size is:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: '256 bits', isCorrect: false },
          { letter: 'B', text: '384 bits', isCorrect: true },
          { letter: 'C', text: '512 bits', isCorrect: false },
          { letter: 'D', text: '1024 bits', isCorrect: false },
        ],
        answer: 'SHA-384 produces a 384-bit hash digest. The number in the name indicates the output size in bits.',
      },
      {
        id: 67,
        text: 'The input of a hash function is:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Fixed-size data', isCorrect: false },
          { letter: 'B', text: 'Variable-size data', isCorrect: true },
          { letter: 'C', text: 'Public key', isCorrect: false },
          { letter: 'D', text: 'Private key', isCorrect: false },
        ],
        answer: 'Hash functions accept variable-length (variable-size) input data and produce a fixed-size hash value (digest).',
      },
      {
        id: 68,
        text: 'The output of a hash function is:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Variable length', isCorrect: false },
          { letter: 'B', text: 'Fixed-length hash value', isCorrect: true },
          { letter: 'C', text: 'Private key', isCorrect: false },
          { letter: 'D', text: 'Public key', isCorrect: false },
        ],
        answer: 'Regardless of the input size, a hash function always produces a fixed-length output (e.g., SHA-256 always gives 256 bits).',
      },
      {
        id: 69,
        text: 'Hash functions accept:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Variable-length data and produce fixed output', isCorrect: true },
          { letter: 'B', text: 'Fixed input and fixed output', isCorrect: false },
          { letter: 'C', text: 'Variable output', isCorrect: false },
          { letter: 'D', text: 'None of the above', isCorrect: false },
        ],
        answer: 'The defining characteristic of hash functions is that they accept variable-length input and always produce a fixed-length hash digest.',
      },
      {
        id: 70,
        text: 'What are the applications of hash functions?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Message Authentication only', isCorrect: false },
          { letter: 'B', text: 'Digital Signature only', isCorrect: false },
          { letter: 'C', text: 'Both Message Authentication and Digital Signature', isCorrect: true },
          { letter: 'D', text: 'Firewall', isCorrect: false },
        ],
        answer: 'Hash functions are used in both Message Authentication (e.g., HMAC) and Digital Signatures (e.g., signing a hash instead of the full message).',
      },
      {
        id: 71,
        text: 'To verify integrity, use:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Firewall', isCorrect: false },
          { letter: 'B', text: 'Access Point', isCorrect: false },
          { letter: 'C', text: 'Message Authentication', isCorrect: true },
          { letter: 'D', text: 'Distribution System', isCorrect: false },
        ],
        answer: 'Message Authentication uses hash functions to verify that data was received exactly as sent and has not been modified.',
      },
      {
        id: 72,
        text: 'The destination verifies the hash using:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: "Sender's public key", isCorrect: true },
          { letter: 'B', text: "Sender's private key", isCorrect: false },
          { letter: 'C', text: 'Shared key', isCorrect: false },
          { letter: 'D', text: "Receiver's private key", isCorrect: false },
        ],
        answer: "In digital signature verification, the receiver uses the sender's public key to decrypt the signature and compare the hash values.",
      },
      {
        id: 73,
        text: 'Digital signature communication is expressed as:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'E(K, [M||H(M||S)])', isCorrect: false },
          { letter: 'B', text: 'M||E(PRa, H(M))', isCorrect: true },
          { letter: 'C', text: 'H(M)||S', isCorrect: false },
          { letter: 'D', text: 'E(K, M)', isCorrect: false },
        ],
        answer: 'M||E(PRa, H(M)) means: the original message M is sent alongside the hash of M encrypted with the sender\'s private key (PRa), forming the digital signature.',
      },
      {
        id: 74,
        text: 'PRa refers to:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: "Sender's private key", isCorrect: true },
          { letter: 'B', text: "Receiver's private key", isCorrect: false },
          { letter: 'C', text: 'Shared key', isCorrect: false },
          { letter: 'D', text: 'Certificate', isCorrect: false },
        ],
        answer: "PRa stands for the sender A's private key. It is used to encrypt the hash to create a digital signature.",
      },
      {
        id: 75,
        text: 'Which expression provides both confidentiality and digital signature?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'M||E(PRa, H(M))', isCorrect: false },
          { letter: 'B', text: 'E(K, [M||E(PRa, H(M))])', isCorrect: true },
          { letter: 'C', text: 'H(M||S)', isCorrect: false },
          { letter: 'D', text: 'E(PRa, M)', isCorrect: false },
        ],
        answer: 'E(K, [M||E(PRa, H(M))]) provides confidentiality (encrypted with shared key K) and digital signature (hash encrypted with sender\'s private key PRa).',
      },
      {
        id: 76,
        text: 'Message authentication expression is:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'M||E(PRa, H(M))', isCorrect: false },
          { letter: 'B', text: 'E(K, [M||H(M||S)])', isCorrect: true },
          { letter: 'C', text: 'E(PRa, H(M))', isCorrect: false },
          { letter: 'D', text: 'H(M)', isCorrect: false },
        ],
        answer: 'E(K, [M||H(M||S)]) is the message authentication expression where S is a shared secret, K is the encryption key, and H(M||S) is the hash of the message concatenated with the secret.',
      },
      {
        id: 77,
        text: 'A hash with 1024-bit input block size and 512-bit output is:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'SHA-256', isCorrect: false },
          { letter: 'B', text: 'SHA-384', isCorrect: false },
          { letter: 'C', text: 'SHA-512', isCorrect: true },
          { letter: 'D', text: 'MD5', isCorrect: false },
        ],
        answer: 'SHA-512 processes input in 1024-bit blocks and produces a 512-bit hash output. SHA-256 uses 512-bit blocks, SHA-384 uses 1024-bit blocks.',
      },
      {
        id: 78,
        text: 'SHA-384 has input block size / output size of:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: '512 / 384', isCorrect: false },
          { letter: 'B', text: '1024 / 384', isCorrect: true },
          { letter: 'C', text: '1024 / 512', isCorrect: false },
          { letter: 'D', text: '512 / 512', isCorrect: false },
        ],
        answer: 'SHA-384 has a 1024-bit input block size and a 384-bit output digest size.',
      },
      {
        id: 79,
        text: 'Variable-length input is processed to produce:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Public key', isCorrect: false },
          { letter: 'B', text: 'Ciphertext', isCorrect: false },
          { letter: 'C', text: 'Fixed-size hash', isCorrect: true },
          { letter: 'D', text: 'Certificate', isCorrect: false },
        ],
        answer: 'The core property of hash functions is that variable-length input data is always processed to produce a fixed-size hash digest.',
      },
      {
        id: 80,
        text: 'The main purpose of a hash function is to produce:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'A fixed-size digest', isCorrect: true },
          { letter: 'B', text: 'A public key', isCorrect: false },
          { letter: 'C', text: 'A certificate', isCorrect: false },
          { letter: 'D', text: 'A WLAN connection', isCorrect: false },
        ],
        answer: 'The primary purpose of any hash function is to take arbitrary-length input and produce a fixed-size digest (hash value) that uniquely represents the input data.',
      },
      {
        id: 81,
        text: 'In digital signature, the source encrypts the hash with:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: "Receiver's public key", isCorrect: false },
          { letter: 'B', text: "Sender's private key", isCorrect: true },
          { letter: 'C', text: 'Shared key', isCorrect: false },
          { letter: 'D', text: "Receiver's private key", isCorrect: false },
        ],
        answer: "In digital signature creation, the sender encrypts the hash of the message with their own private key (PRa). The receiver verifies it using the sender's public key.",
      },
    ],
  },
  {
    id: 7,
    title: 'Revision Sheet — Network Security (MCQ)',
    marks: '15 pts',
    icon: '🛡️',
    questions: [
      {
        id: 82,
        text: 'A DMZ System provides:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Basic protection for the remainder of the network', isCorrect: true },
          { letter: 'B', text: 'Encryption only', isCorrect: false },
          { letter: 'C', text: 'Routing only', isCorrect: false },
          { letter: 'D', text: 'Authentication only', isCorrect: false },
        ],
        answer: 'A DMZ (Demilitarized Zone) provides a basic level of protection for the remainder of the network by isolating publicly accessible servers from the internal network.',
      },
      {
        id: 83,
        text: 'In which phase does a Station (STA) select an Access Point (AP) to communicate?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Connection Termination', isCorrect: false },
          { letter: 'B', text: 'Key Management Phase', isCorrect: false },
          { letter: 'C', text: 'Discovery Phase', isCorrect: true },
          { letter: 'D', text: 'Authentication Phase', isCorrect: false },
        ],
        answer: 'In the Discovery Phase, a station discovers available APs in range and selects one to communicate with before proceeding to authentication.',
      },
      {
        id: 84,
        text: 'Y<<X>> is a certificate of:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'User Y issued by authority X', isCorrect: false },
          { letter: 'B', text: 'User X issued by authority Y', isCorrect: true },
          { letter: 'C', text: 'Both X and Y issued by root', isCorrect: false },
          { letter: 'D', text: 'None of the above', isCorrect: false },
        ],
        answer: 'In the notation Y<<X>>, Y is the issuing Certificate Authority and X is the user whose certificate it is. So Y<<X>> means "the certificate of user X issued by authority Y".',
      },
      {
        id: 85,
        text: 'Any user can read a certificate to determine the name and:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Public key', isCorrect: true },
          { letter: 'B', text: 'Private key', isCorrect: false },
          { letter: 'C', text: 'Encryption algorithm', isCorrect: false },
          { letter: 'D', text: 'Scrambled message', isCorrect: false },
        ],
        answer: 'A certificate is readable by anyone and contains the owner\'s name and public key. The private key is never included in a certificate.',
      },
      {
        id: 86,
        text: 'In which system is only authorized traffic allowed to pass?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Hash Function', isCorrect: false },
          { letter: 'B', text: 'Firewall', isCorrect: true },
          { letter: 'C', text: 'Ciphertext', isCorrect: false },
          { letter: 'D', text: 'Digital Signature', isCorrect: false },
        ],
        answer: 'A firewall is a network security device that monitors and filters incoming and outgoing network traffic based on an organization\'s security policies, allowing only authorized traffic to pass.',
      },
      {
        id: 87,
        text: 'Authentication phase is a mutual authentication between Station and:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Authorized Servers', isCorrect: false },
          { letter: 'B', text: 'Firewall', isCorrect: false },
          { letter: 'C', text: 'Distribution System', isCorrect: false },
          { letter: 'D', text: 'Access Point', isCorrect: true },
        ],
        answer: 'The Authentication Phase involves mutual authentication between the station (STA) and the Access Point (AP), where both parties verify each other\'s identity.',
      },
      {
        id: 88,
        text: 'Which component is inserted between the local network and the Internet?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Authorized Servers', isCorrect: false },
          { letter: 'B', text: 'Access Point', isCorrect: false },
          { letter: 'C', text: 'Distribution System', isCorrect: false },
          { letter: 'D', text: 'Firewall', isCorrect: true },
        ],
        answer: 'A firewall is inserted between the local network and the Internet to control and monitor traffic, blocking unauthorized access while permitting authorized communications.',
      },
      {
        id: 89,
        text: 'Which firewall is placed at the edge of the network?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Internal firewall', isCorrect: false },
          { letter: 'B', text: 'External firewall', isCorrect: true },
          { letter: 'C', text: 'DMZ System', isCorrect: false },
          { letter: 'D', text: 'Single choke point', isCorrect: false },
        ],
        answer: 'The external firewall is placed at the edge of the network, between the Internet and the DMZ, providing the first line of defense against external threats.',
      },
      {
        id: 90,
        text: 'Which component provides two-way protection with respect to the DMZ?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Internal firewall', isCorrect: true },
          { letter: 'B', text: 'External firewall', isCorrect: false },
          { letter: 'C', text: 'DMZ System', isCorrect: false },
          { letter: 'D', text: 'Single choke point', isCorrect: false },
        ],
        answer: 'The internal firewall provides two-way protection with respect to the DMZ — it protects the internal network from DMZ traffic and controls outbound traffic from the internal network to the DMZ.',
      },
      {
        id: 91,
        text: 'The encryption algorithm performs transformations on plaintext to produce:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Message Authentication', isCorrect: false },
          { letter: 'B', text: 'Digital signature', isCorrect: false },
          { letter: 'C', text: 'Decryption', isCorrect: false },
          { letter: 'D', text: 'Ciphertext', isCorrect: true },
        ],
        answer: 'The encryption algorithm takes plaintext and a key as input and produces ciphertext as output, making the data unreadable without the correct decryption key.',
      },
      {
        id: 92,
        text: 'Each user applies to the Certificate Authority, gives a public key and requests:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Private Key', isCorrect: false },
          { letter: 'B', text: 'Certificate', isCorrect: true },
          { letter: 'C', text: 'Hash Function', isCorrect: false },
          { letter: 'D', text: 'Digital Signature', isCorrect: false },
        ],
        answer: 'Users apply to the Certificate Authority by providing their public key and requesting a certificate that binds their identity to that public key.',
      },
      {
        id: 93,
        text: 'In DMZ Networks, the external firewall provides:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Internal firewall', isCorrect: false },
          { letter: 'B', text: 'Basic protection for the remainder of the network', isCorrect: true },
          { letter: 'C', text: 'Hash Function', isCorrect: false },
          { letter: 'D', text: 'Single choke point', isCorrect: false },
        ],
        answer: 'In a DMZ configuration, the external firewall provides basic protection for the remainder of the network (the internal network) by filtering traffic between the Internet and the DMZ.',
      },
      {
        id: 94,
        text: 'In public-key encryption, which keys are generated locally and can be changed at any time?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Encryption algorithm', isCorrect: false },
          { letter: 'B', text: 'Private keys', isCorrect: true },
          { letter: 'C', text: 'Scrambled message', isCorrect: false },
          { letter: 'D', text: 'Public key', isCorrect: false },
        ],
        answer: 'In public-key encryption, the private key is generated locally by the user and can be changed at any time. The corresponding public key is then distributed to others.',
      },
      {
        id: 95,
        text: 'The decryption algorithm performs transformations on a scrambled message to produce:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Message Authentication', isCorrect: false },
          { letter: 'B', text: 'Digital signature', isCorrect: false },
          { letter: 'C', text: 'Plaintext', isCorrect: true },
          { letter: 'D', text: 'Encryption', isCorrect: false },
        ],
        answer: 'The decryption algorithm reverses the encryption process, taking the scrambled message (ciphertext) and the key to produce the original plaintext.',
      },
      {
        id: 96,
        text: 'In message authentication, S is a common ___ shared between A and B:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Digital signature', isCorrect: false },
          { letter: 'B', text: 'Private key', isCorrect: false },
          { letter: 'C', text: 'Public key', isCorrect: false },
          { letter: 'D', text: 'Secret value', isCorrect: true },
        ],
        answer: 'In message authentication, S is a common secret value shared between the communicating parties A and B, used in the hash computation: E(K, [M||H(M||S)]).',
      },
    ],
  },
  {
    id: 8,
    title: 'Revision Sheet — True/False',
    marks: '12 pts',
    icon: '✅',
    questions: [
      {
        id: 97,
        text: 'A certificate links identity to a public key and includes validity information.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: true },
          { letter: 'F', text: 'False', isCorrect: false },
        ],
        answer: 'True. A certificate binds the user\'s identity to their public key and includes a period of validity, rights of use, and other metadata signed by the Certificate Authority.',
      },
      {
        id: 98,
        text: 'Any user can determine the owner\'s private key from a certificate.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: false },
          { letter: 'F', text: 'False', isCorrect: true },
        ],
        answer: 'False. A certificate only contains the owner\'s public key, never the private key. It is computationally infeasible to derive the private key from the public key in the certificate.',
      },
      {
        id: 99,
        text: 'Y<<X>> is a certificate of user X issued by authority Y.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: true },
          { letter: 'F', text: 'False', isCorrect: false },
        ],
        answer: 'True. In CA hierarchy notation, Y<<X>> means the certificate of user X that was issued and signed by the Certificate Authority Y.',
      },
      {
        id: 100,
        text: 'In a wired LAN, any station within radio range can transmit and receive.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: false },
          { letter: 'F', text: 'False', isCorrect: true },
        ],
        answer: 'False. Radio range is a characteristic of Wireless LANs, not Wired LANs. In wired LANs, stations must be physically connected via cables to transmit and receive.',
      },
      {
        id: 101,
        text: 'Distribution System interconnects BSSs to form an ESS.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: true },
          { letter: 'F', text: 'False', isCorrect: false },
        ],
        answer: 'True. The Distribution System interconnects multiple Basic Service Sets (BSSs) and integrated LANs to form an Extended Service Set (ESS), enabling seamless roaming.',
      },
      {
        id: 102,
        text: 'Access Point provides access to the Distribution System.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: true },
          { letter: 'F', text: 'False', isCorrect: false },
        ],
        answer: 'True. The Access Point (AP) provides access to the Distribution System via the wireless medium for linked stations, acting as a bridge between wireless and wired networks.',
      },
      {
        id: 103,
        text: 'Only unauthorized traffic is allowed to pass through a firewall.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: false },
          { letter: 'F', text: 'False', isCorrect: true },
        ],
        answer: 'False. A firewall allows only AUTHORIZED traffic to pass and blocks unauthorized traffic. It enforces security policies by filtering network traffic.',
      },
      {
        id: 104,
        text: 'Key Management Phase generates and distributes cryptographic keys.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: true },
          { letter: 'F', text: 'False', isCorrect: false },
        ],
        answer: 'True. The Key Management Phase is responsible for generating and distributing a variety of cryptographic keys used for secure communication in WLAN.',
      },
      {
        id: 105,
        text: 'Stations in WLAN select an Access Point to communicate.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: true },
          { letter: 'F', text: 'False', isCorrect: false },
        ],
        answer: 'True. In WLAN infrastructure mode, stations select an Access Point (AP) to communicate with. The AP then provides connectivity to the distribution system.',
      },
      {
        id: 106,
        text: 'Wired LANs require physical connectivity and provide privacy.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: true },
          { letter: 'F', text: 'False', isCorrect: false },
        ],
        answer: 'True. Wired LANs require physical connectivity (cable connections) and provide a degree of privacy since signals don\'t propagate through the air like wireless networks.',
      },
      {
        id: 107,
        text: 'Certificate contents are signed by a trusted Certificate Authority.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: true },
          { letter: 'F', text: 'False', isCorrect: false },
        ],
        answer: 'True. The Certificate Authority (CA) signs the certificate contents with its private key, establishing trust. Anyone with the CA\'s public key can verify the signature.',
      },
      {
        id: 108,
        text: 'WEP provides stronger security than WPA.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: false },
          { letter: 'F', text: 'False', isCorrect: true },
        ],
        answer: 'False. WPA (Wi-Fi Protected Access) provides significantly stronger security than WEP (Wired Equivalent Privacy). WEP has known vulnerabilities and has been deprecated.',
      },
    ],
  },
  {
    id: 9,
    title: 'Practice Exam — Diagram & Essay',
    marks: '10 pts',
    icon: '📐',
    questions: [
      {
        id: 109,
        text: 'In digital signature, consider the communication: A → B: E(K, [M || E(PRa, H(M))]). Draw a diagram for the verification (reverse) operation at the receiver B.',
        marks: '5 pts',
        type: 'code',
        answer: 'The verification process at receiver B involves two main operations: decryption of the outer layer and verification of the digital signature.',
        answerCode: 'Verification Diagram at Receiver B:\n\nReceived: E(K, [M || E(PRa, H(M))])\n\nStep 1: Decrypt with Shared Key K\n  D(K, E(K, [M || E(PRa, H(M))]))  →  M || E(PRa, H(M))\n  Result: Message M + Encrypted Signature\n\nStep 2: Separate the components\n  Extract: M (original message)\n  Extract: E(PRa, H(M)) (digital signature)\n\nStep 3: Compute local hash\n  H(M) → Hash_new\n\nStep 4: Decrypt signature with Sender A\'s Public Key (PUa)\n  D(PUa, E(PRa, H(M))) → Hash_original\n\nStep 5: Compare hashes\n  If Hash_new == Hash_original → Valid Signature ✓\n  Else → Invalid Signature ✗\n\nDiagram:\nE(K,[M||E(PRa,H(M))])\n         │\n    ┌────▼────┐\n    │ D(K, .) │  ← Decrypt with shared key K\n    └────┬────┘\n         │\n    M || E(PRa,H(M))\n    │         │\n    │    ┌────▼─────┐\n    │    │D(PUa, .) │ ← Decrypt with A\'s public key\n    │    └────┬─────┘\n    │         │\n    │      H(M) received\n    │         │\n  ┌─▼──┐     │\n  │H(M)│     │\n  │new │     │\n  └─┬──┘     │\n    │        │\n    └──╳─────┘  Compare: Equal? → Valid',
      },
      {
        id: 110,
        text: 'In digital signature with confidentiality, consider: A → B: E(K, [M || E(PRa, H(M))]), where PRa is the private key. Explain each step of the verification at the receiver and what each component provides.',
        marks: '5 pts',
        type: 'code',
        answer: 'This communication combines confidentiality (via shared key K) with digital signature (via sender\'s private key PRa). The verification involves both decrypting and authenticating.',
        answerCode: 'Verification Steps at Receiver B:\n\nThe received message is: E(K, [M || E(PRa, H(M))])\n\nComponents explanation:\n  - E(K, ...) = Outer encryption with shared key K → provides CONFIDENTIALITY\n  - M = The original plaintext message\n  - E(PRa, H(M)) = Hash encrypted with sender\'s private key → provides DIGITAL SIGNATURE\n\nStep-by-step verification:\n\n1. CONFIDENTIALITY REMOVAL:\n   Apply: D(K, E(K, [M || E(PRa, H(M))]))\n   Using the shared secret key K between A and B\n   Result: M || E(PRa, H(M))\n   This ensures only A and B can read the content.\n\n2. SEPARATION:\n   Split into: Message M  and  Signature E(PRa, H(M))\n\n3. SIGNATURE VERIFICATION:\n   a) Compute local hash: H(M) → Hash_local\n   b) Decrypt signature: D(PUa, E(PRa, H(M))) → Hash_received\n      Using sender A\'s public key PUa\n   c) Compare: Hash_local == Hash_received ?\n      - YES → Message is authentic and intact\n      - NO → Message was tampered or not from A\n\nWhat each provides:\n  - K (shared key) → Confidentiality\n  - PRa (A\'s private key) → Authentication & Integrity\n  - H(M) (hash) → Integrity check\n  - PUa (A\'s public key) → Verification of sender',
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
const STORAGE_KEY = 'prepify-cs2-progress'

// ─── Main Component ──────────────────────────────────
export default function CyberSecurityPage() {
  const [questionStates, setQuestionStates] = useState<Record<number, QuestionState>>({})
  const [activeSection, setActiveSection] = useState<number | null>(null)
  const [scoreSubmitted, setScoreSubmitted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)
  const sectionNavRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
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
    setStartX(clientX)
    setScrollLeft(el.scrollLeft)
  }, [])

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging) return
    const el = sectionNavRef.current
    if (!el) return
    const walk = (clientX - startX) * 1.5
    el.scrollLeft = scrollLeft - walk
  }, [isDragging, startX, scrollLeft])

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // ─── Rating State ───────────────────────────────────
  const [quizRating, setQuizRating] = useState(0)
  const [quizFeedback, setQuizFeedback] = useState('')
  const [quizFbSubmitting, setQuizFbSubmitting] = useState(false)
  const [quizFbSubmitted, setQuizFbSubmitted] = useState(false)
  const [quizFbError, setQuizFbError] = useState('')

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
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [correctCount, totalQuestions])

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
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #ef4444, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #dc2626, transparent 70%)' }} />
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
                  background: ['#ef4444', '#dc2626', '#7c3aed', '#00d4ff', '#10b981', '#f59e0b'][i % 6],
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
        {/* Mobile-Friendly Top Navbar */}
        <motion.nav
          className="sticky top-0 z-50 backdrop-blur-xl bg-[#080c18]/90 border-b border-[#1e2d45] -mx-4 px-4 py-2.5 sm:py-3"
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between gap-3">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-2.5 min-w-0">
              <a href="/" className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#111827] border border-[#1e2d45] flex items-center justify-center text-[#64748b] hover:text-[#ef4444] hover:border-[#ef4444]/50 transition-all">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </a>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-black truncate bg-gradient-to-r from-[#ef4444] to-[#dc2626] bg-clip-text text-transparent">Cyber Security 2</h2>
                <p className="text-[10px] sm:text-xs text-[#64748b] truncate">{answeredCount}/{totalQuestions} answered</p>
              </div>
            </div>

            {/* Right: Mini Progress Ring */}
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke="#1e2d45" strokeWidth="3" />
                <motion.circle
                  cx="22" cy="22" r="18" fill="none"
                  stroke="url(#navProgressGrad)" strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={113.1}
                  animate={{ strokeDashoffset: 113.1 - (113.1 * answeredCount / totalQuestions) }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="navProgressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[9px] sm:text-[10px] font-black text-[#ef4444]">{Math.round((answeredCount / totalQuestions) * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Thin animated progress bar under nav */}
          <div className="h-1 bg-[#1e2d45] rounded-full overflow-hidden mt-2">
            <motion.div
              className="h-full bg-gradient-to-r from-[#ef4444] via-[#dc2626] to-[#7c3aed] rounded-full"
              animate={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                boxShadow: answeredCount > 0 ? '0 0 8px rgba(239,68,68,0.4)' : 'none',
              }}
            />
          </div>
        </motion.nav>

        {/* Header */}
        <motion.header
          className="text-center pt-10 pb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Prepify Logo" className="w-24 h-24 md:w-28 md:h-28 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.3)]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-2">
            <span className="bg-gradient-to-r from-[#ef4444] to-[#dc2626] bg-clip-text text-transparent">Cyber Security 2</span>
            <br />
            <span className="text-[#00d4ff]">Comprehensive Question Bank</span>
          </h1>
          <p className="text-[#64748b] text-sm mb-2">
            Based on Exams 2023, 2024, Tutorials, and Assignments
          </p>
          <p className="text-[#64748b] text-[15px] mb-6">
            Mahmoud ABD ELKream
          </p>
          <div className="flex justify-center gap-6 flex-wrap mt-4">
            <div className="text-center bg-[#111827] border border-[#1e2d45] rounded-2xl px-6 py-3 min-w-[90px]">
              <div className="text-2xl font-black text-[#ef4444]">{totalQuestions}</div>
              <div className="text-[11px] text-[#64748b]">Questions</div>
            </div>
            <div className="text-center bg-[#111827] border border-[#1e2d45] rounded-2xl px-6 py-3 min-w-[90px]">
              <div className="text-2xl font-black text-[#10b981]">{totalMarks}</div>
              <div className="text-[11px] text-[#64748b]">Marks</div>
            </div>
            <div className="text-center bg-[#111827] border border-[#1e2d45] rounded-2xl px-6 py-3 min-w-[90px]">
              <div className="text-2xl font-black text-[#7c3aed]">{sections.length}</div>
              <div className="text-[11px] text-[#64748b]">Sections</div>
            </div>
            <div className="text-center bg-[#111827] border border-[#1e2d45] rounded-2xl px-6 py-3 min-w-[90px]">
              <div className="text-2xl font-black text-[#f59e0b]">{correctCount}</div>
              <div className="text-[11px] text-[#64748b]">Correct</div>
            </div>
          </div>
        </motion.header>

        {/* Sticky Controls Bar - Mobile Optimized */}
        <div className="bg-[#111827]/90 border border-[#1e2d45] rounded-2xl p-2.5 sm:p-3 mb-6 sticky top-[68px] sm:top-[76px] z-40 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
          {/* Section nav pills - draggable with fade indicators */}
          <div className="relative">
            {/* Left fade indicator */}
            <div className={`absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-300 ${showLeftFade ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'linear-gradient(to right, #111827, transparent)' }} />
            {/* Right fade indicator */}
            <div className={`absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-300 ${showRightFade ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'linear-gradient(to left, #111827, transparent)' }} />
            <div
              ref={sectionNavRef}
              className={`flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onMouseDown={(e) => { e.preventDefault(); handleDragStart(e.clientX) }}
              onMouseMove={(e) => handleDragMove(e.clientX)}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
              onTouchEnd={handleDragEnd}
            >
              {sections.map(s => {
                const sAnswered = s.questions.filter(q => {
                  const qs = questionStates[q.id]
                  return qs && (qs.isChecked || qs.isSolutionRevealed || qs.selectedMcq !== null || qs.userCode.trim().length > 0 || Object.keys(qs.fillAnswers).length > 0)
                }).length
                const sTotal = s.questions.length
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      if (!isDragging) {
                        document.querySelector(`[data-section-id="${s.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }
                    }}
                    className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                      activeSection === s.id
                        ? 'bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white border-transparent shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                        : 'bg-[#1a2235] text-[#64748b] border-[#1e2d45] hover:border-[#ef4444]/50 hover:text-[#ef4444]'
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span className="hidden sm:inline">Section {s.id}</span>
                    <span className="sm:hidden">S{s.id}</span>
                    <span className="text-[9px] opacity-60">{sAnswered}/{sTotal}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Action buttons - compact row */}
          <div className="flex items-center justify-between mt-2 gap-2">
            <div className="flex gap-1.5 sm:gap-2">
              <button
                onClick={revealAllSolutions}
                className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white border-none rounded-lg px-2.5 sm:px-4 py-1.5 font-bold text-[10px] sm:text-xs cursor-pointer hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                <span className="sm:hidden">Solutions</span>
                <span className="hidden sm:inline">Show All Solutions</span>
              </button>
              <button
                onClick={hideAllSolutions}
                className="bg-transparent text-[#64748b] border border-[#1e2d45] rounded-lg px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs cursor-pointer hover:border-[#64748b] transition-colors"
              >
                Hide
              </button>
              <button
                onClick={resetAll}
                className="bg-transparent text-[#ef4444] border border-[#ef4444]/30 rounded-lg px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs cursor-pointer hover:bg-[#ef4444]/10 transition-colors"
              >
                Reset
              </button>
            </div>
            <div className="text-[10px] sm:text-xs text-[#64748b] whitespace-nowrap">
              {answeredCount}/{totalQuestions}
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
              <div className="w-[48px] h-[48px] bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-[14px] flex items-center justify-center text-2xl shrink-0 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                {section.icon}
              </div>
              <div className="flex-1">
                <div className="text-lg font-black">{section.title}</div>
                <div className="text-xs text-[#64748b]">Section {section.id} of {sections.length}</div>
              </div>
              <div className="bg-[#1a2235] border border-[#1e2d45] px-4 py-2 rounded-full text-sm font-bold text-[#ef4444] shadow-[0_0_10px_rgba(239,68,68,0.1)]">
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
              className="bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white border-none rounded-2xl px-12 py-4 font-black text-xl cursor-pointer transition-all shadow-[0_0_40px_rgba(239,68,68,0.3)] hover:shadow-[0_0_60px_rgba(239,68,68,0.5)] hover:-translate-y-1 active:translate-y-0"
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
          />
        )}

        {/* ─── Quiz Rating / Evaluation ─── */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-[#111827] border border-[#1e2d45] rounded-3xl p-6 sm:p-8 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
            <div className="text-center mb-6">
              <div className="inline-block bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white text-[11px] font-bold tracking-[2px] uppercase px-5 py-1.5 rounded-full mb-3 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                Rate This Quiz
              </div>
              <h3 className="text-xl sm:text-2xl font-black">How was your experience?</h3>
              <p className="text-[#64748b] text-sm mt-1">Your feedback helps us improve the quiz for everyone</p>
            </div>

            {quizFbSubmitted ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#10b981] to-[#059669] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h4 className="text-lg font-black mb-2">Thank You!</h4>
                <p className="text-[#64748b] text-sm mb-4">Your feedback has been submitted successfully!</p>
                <button
                  onClick={() => { setQuizFbSubmitted(false); setQuizRating(0); setQuizFeedback('') }}
                  className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white border-none rounded-xl px-5 py-2.5 font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Submit Again
                </button>
              </div>
            ) : (
              <>
                {/* Stars */}
                <div className="flex justify-center gap-3 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setQuizRating(star)}
                      className="text-4xl transition-all cursor-pointer hover:scale-110 active:scale-95"
                      style={{ color: star <= quizRating ? '#f59e0b' : '#1e2d45' }}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-sm text-[#64748b] ml-2 self-center">{quizRating > 0 ? `${quizRating}/5` : 'Select rating'}</span>
                </div>

                {/* Feedback text */}
                <div className="mb-5">
                  <textarea
                    value={quizFeedback}
                    onChange={(e) => setQuizFeedback(e.target.value)}
                    placeholder="Share your thoughts about this quiz... (optional)"
                    rows={3}
                    className="w-full bg-[#080c18] border border-[#1e2d45] rounded-xl px-4 py-3 text-sm text-[#e2e8f0] placeholder-[#475569] focus:border-[#f59e0b] focus:outline-none focus:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all resize-none"
                  />
                </div>

                {quizFbError && (
                  <div className="mb-4 bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] text-sm rounded-xl px-4 py-3">
                    {quizFbError}
                  </div>
                )}

                <button
                  onClick={async () => {
                    setQuizFbError('')
                    if (quizRating === 0) {
                      setQuizFbError('Please select a rating before submitting.')
                      return
                    }
                    setQuizFbSubmitting(true)
                    try {
                      const res = await fetch('/api/feedback', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          name: 'Cyber Security 2 User',
                          email: 'quiz@prepify.app',
                          message: quizFeedback.trim() || `Rated Cyber Security 2 quiz ${quizRating}/5`,
                          rating: quizRating,
                          subject: 'cyber-security-2',
                        }),
                      })
                      if (!res.ok) {
                        const data = await res.json()
                        setQuizFbError(data.error || 'Something went wrong.')
                        return
                      }
                      setQuizFbSubmitted(true)
                    } catch {
                      setQuizFbError('Network error. Please try again.')
                    } finally {
                      setQuizFbSubmitting(false)
                    }
                  }}
                  disabled={quizFbSubmitting}
                  className="w-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white border-none rounded-xl px-6 py-3.5 font-black text-base cursor-pointer hover:opacity-90 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 inline-flex items-center justify-center gap-2"
                >
                  {quizFbSubmitting ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Rating
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </motion.div>

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
            Cyber Security 2 Quiz — <span className="text-[#ef4444]">Mahmoud ABD ELKream</span>
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
}: {
  correctCount: number
  totalQuestions: number
  answeredCount: number
  onReset: () => void
  onRevealAll: () => void
}) {
  const pct = Math.round((correctCount / totalQuestions) * 100)
  const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : pct >= 50 ? 'D' : 'F'
  const gradeColor = pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444'

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
            stroke="url(#csScoreGrad)" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={440}
            initial={{ strokeDashoffset: 440 }}
            animate={{ strokeDashoffset: 440 - (440 * pct / 100) }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="csScoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            className="text-4xl font-black bg-gradient-to-r from-[#ef4444] to-[#dc2626] bg-clip-text text-transparent"
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
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
          className="bg-transparent text-[#64748b] border-2 border-[#1e2d45] rounded-xl px-6 py-3 font-bold text-sm cursor-pointer hover:border-[#ef4444] hover:text-[#ef4444] transition-all"
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
    ? '#ef4444'
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
            ? 'bg-[#ef4444] text-white'
            : 'bg-[#1a2235] border border-[#1e2d45] text-[#ef4444]'
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
            'bg-[#ef4444]/20 text-[#f87171]'
          }`}>
            {question.type === 'mcq' ? 'MCQ' :
             question.type === 'tf' ? 'T/F' :
             question.type === 'trace' ? 'Trace' :
             question.type === 'fill' ? 'Fill' : 'Essay'}
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
                      ? 'border-[#ef4444] bg-[rgba(239,68,68,0.15)] text-[#fca5a5] shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                      : 'border-[#1e2d45] bg-[#0d1117] text-[#e2e8f0] hover:border-[#ef4444]/50 hover:bg-[rgba(239,68,68,0.05)]'
                  }`}
                >
                  <span className={`w-[28px] h-[28px] rounded-lg flex items-center justify-center font-bold text-xs shrink-0 font-mono transition-colors ${
                    showResult && opt.isCorrect
                      ? 'bg-[#10b981] text-white'
                      : showResult && isSelected && !opt.isCorrect
                      ? 'bg-[#ef4444] text-white'
                      : isSelected
                      ? 'bg-[#ef4444] text-white'
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
                          : 'bg-[#0d1117] border-[#1e2d45] text-[#e2e8f0] focus:border-[#ef4444] focus:shadow-[0_0_10px_rgba(239,68,68,0.1)]'
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

        {/* ── Code / Essay textarea ── */}
        {(question.type === 'code' || question.type === 'trace') && (
          <div className="mt-3 relative">
            <textarea
              value={state.userCode}
              onChange={e => onUpdate(question.id, { userCode: e.target.value })}
              placeholder={question.type === 'trace' ? 'Write the expected output here...' : 'Write your answer here...'}
              dir="ltr"
              className="w-full bg-[#0a0f1e] border border-[#1e2d45] rounded-xl p-4 font-mono text-[13px] text-[#e2e8f0] min-h-[120px] resize-y outline-none transition-all duration-200 focus:border-[#ef4444] focus:shadow-[0_0_15px_rgba(239,68,68,0.1)] placeholder:text-[#334155]"
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
              className="bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white border-none rounded-lg px-5 py-2.5 font-bold text-sm cursor-pointer hover:opacity-90 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-[0_0_20px_rgba(239,68,68,0.2)] disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
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
              className="bg-[rgba(239,68,68,0.1)] text-[#ef4444] border border-[#ef4444]/30 rounded-lg px-5 py-2.5 font-bold text-sm cursor-pointer hover:bg-[rgba(239,68,68,0.2)] transition-all"
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
              <div className="mt-4 p-5 rounded-xl bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.2)]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[#10b981] font-bold text-sm">Model Solution:</span>
                </div>
                <div className="text-[14px] leading-relaxed text-[#94a3b8] mb-3">
                  {question.answer}
                </div>
                {question.answerCode && (
                  <pre className="bg-[#0a0f1e] border border-[#1e2d45] rounded-xl p-4 font-mono text-[13px] leading-relaxed text-left whitespace-pre-wrap overflow-x-auto text-[#6ee7b7] shadow-[inset_0_0_30px_rgba(0,0,0,0.3)]" dir="ltr">
                    {question.answerCode}
                  </pre>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
