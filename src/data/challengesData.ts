import { Challenge } from '../types';

export const CHALLENGES: Challenge[] = [
  {
    id: 'two-sum',
    title: 'Two Sum Problem',
    category: 'Arrays',
    difficulty: 'Easy',
    language: 'javascript',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.
You may assume that each input would have exactly one solution, and you may not use the same element twice.
Return the answer as an array of two indices [index1, index2] sorted ascending.`,
    inputFormat: 'Array of numbers and target number',
    outputFormat: 'Array of two indices [i, j]',
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9',
    sampleInput: 'nums = [2, 7, 11, 15], target = 9',
    sampleOutput: '[0, 1]',
    starterCode: `function twoSum(nums, target) {
  // Your code here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// Test call
console.log(twoSum([2, 7, 11, 15], 9));`,
    hints: [
      'A brute force solution takes O(n^2) by checking every pair.',
      'Can you use a Hash Map to check if target - nums[i] has already been seen in O(1) time?'
    ],
    testCases: [
      {
        input: '[2, 7, 11, 15], 9',
        expectedOutput: '[0, 1]',
        callWrapper: 'console.log(JSON.stringify(twoSum([2, 7, 11, 15], 9)));'
      },
      {
        input: '[3, 2, 4], 6',
        expectedOutput: '[1, 2]',
        callWrapper: 'console.log(JSON.stringify(twoSum([3, 2, 4], 6)));'
      },
      {
        input: '[3, 3], 6',
        expectedOutput: '[0, 1]',
        callWrapper: 'console.log(JSON.stringify(twoSum([3, 3], 6)));'
      }
    ]
  },
  {
    id: 'palindrome-check',
    title: 'Valid Palindrome',
    category: 'Strings',
    difficulty: 'Easy',
    language: 'javascript',
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.
Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
    inputFormat: 'Single string s',
    outputFormat: 'Boolean (true or false)',
    constraints: '1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters',
    sampleInput: '"A man, a plan, a canal: Panama"',
    sampleOutput: 'true',
    starterCode: `function isPalindrome(s) {
  // Your code here
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0;
  let right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}

// Test call
console.log(isPalindrome("A man, a plan, a canal: Panama"));`,
    hints: [
      'First strip out all non-alphanumeric characters and lowercase the string.',
      'Use two pointers starting from both ends moving inward.'
    ],
    testCases: [
      {
        input: '"A man, a plan, a canal: Panama"',
        expectedOutput: 'true',
        callWrapper: 'console.log(isPalindrome("A man, a plan, a canal: Panama"));'
      },
      {
        input: '"race a car"',
        expectedOutput: 'false',
        callWrapper: 'console.log(isPalindrome("race a car"));'
      },
      {
        input: '" "',
        expectedOutput: 'true',
        callWrapper: 'console.log(isPalindrome(" "));'
      }
    ]
  },
  {
    id: 'fizz-buzz',
    title: 'FizzBuzz Classic',
    category: 'Loops',
    difficulty: 'Easy',
    language: 'javascript',
    description: `Given an integer \`n\`, return a string array \`answer\` (1-indexed) where:
- \`answer[i] == "FizzBuzz"\` if i is divisible by 3 and 5.
- \`answer[i] == "Fizz"\` if i is divisible by 3.
- \`answer[i] == "Buzz"\` if i is divisible by 5.
- \`answer[i] == i.toString()\` if none of the above conditions are true.`,
    inputFormat: 'Positive integer n',
    outputFormat: 'Array of strings',
    constraints: '1 <= n <= 10^4',
    sampleInput: 'n = 5',
    sampleOutput: '["1", "2", "Fizz", "4", "Buzz"]',
    starterCode: `function fizzBuzz(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) result.push("FizzBuzz");
    else if (i % 3 === 0) result.push("Fizz");
    else if (i % 5 === 0) result.push("Buzz");
    else result.push(String(i));
  }
  return result;
}

console.log(fizzBuzz(5));`,
    hints: [
      'Check the 15 (3 and 5) divisibility condition first before separate 3 or 5 checks.'
    ],
    testCases: [
      {
        input: '3',
        expectedOutput: '["1","2","Fizz"]',
        callWrapper: 'console.log(JSON.stringify(fizzBuzz(3)));'
      },
      {
        input: '5',
        expectedOutput: '["1","2","Fizz","4","Buzz"]',
        callWrapper: 'console.log(JSON.stringify(fizzBuzz(5)));'
      }
    ]
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse Singly Linked List',
    category: 'Data structures',
    difficulty: 'Medium',
    language: 'javascript',
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list values as an array.`,
    inputFormat: 'Array representing list nodes [1, 2, 3, 4, 5]',
    outputFormat: 'Array representing reversed nodes [5, 4, 3, 2, 1]',
    constraints: '0 <= list length <= 5000',
    sampleInput: '[1, 2, 3, 4, 5]',
    sampleOutput: '[5, 4, 3, 2, 1]',
    starterCode: `function reverseList(arr) {
  // Simulate reversing node pointers
  const reversed = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    reversed.push(arr[i]);
  }
  return reversed;
}

console.log(reverseList([1, 2, 3, 4, 5]));`,
    hints: [
      'In a real pointer linked list, keep track of prev, curr, and next pointers.'
    ],
    testCases: [
      {
        input: '[1, 2, 3, 4, 5]',
        expectedOutput: '[5,4,3,2,1]',
        callWrapper: 'console.log(JSON.stringify(reverseList([1, 2, 3, 4, 5])));'
      },
      {
        input: '[1, 2]',
        expectedOutput: '[2,1]',
        callWrapper: 'console.log(JSON.stringify(reverseList([1, 2])));'
      }
    ]
  },
  {
    id: 'binary-search',
    title: 'Binary Search Algorithm',
    category: 'Algorithms',
    difficulty: 'Easy',
    language: 'javascript',
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.
You must write an algorithm with \`O(log n)\` runtime complexity.`,
    inputFormat: 'Sorted array of numbers, target value',
    outputFormat: 'Index or -1',
    constraints: '1 <= nums.length <= 10^4\nAll integers in nums are unique.',
    sampleInput: 'nums = [-1, 0, 3, 5, 9, 12], target = 9',
    sampleOutput: '4',
    starterCode: `function search(nums, target) {
  let low = 0;
  let high = nums.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}

console.log(search([-1, 0, 3, 5, 9, 12], 9));`,
    hints: [
      'Cut the search space in half each iteration by comparing the target with the middle element.'
    ],
    testCases: [
      {
        input: '[-1, 0, 3, 5, 9, 12], 9',
        expectedOutput: '4',
        callWrapper: 'console.log(search([-1, 0, 3, 5, 9, 12], 9));'
      },
      {
        input: '[-1, 0, 3, 5, 9, 12], 2',
        expectedOutput: '-1',
        callWrapper: 'console.log(search([-1, 0, 3, 5, 9, 12], 2));'
      }
    ]
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses Stack',
    category: 'Data structures',
    difficulty: 'Medium',
    language: 'javascript',
    description: `Given a string \`s\` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    inputFormat: 'String containing brackets',
    outputFormat: 'true or false',
    constraints: '1 <= s.length <= 10^4',
    sampleInput: '"()[]{}"',
    sampleOutput: 'true',
    starterCode: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };

  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}

console.log(isValid("()[]{}"));`,
    hints: [
      'Use a Last-In First-Out (LIFO) stack to match the most recently opened bracket.'
    ],
    testCases: [
      {
        input: '"()[]{}"',
        expectedOutput: 'true',
        callWrapper: 'console.log(isValid("()[]{}"));'
      },
      {
        input: '"(]"',
        expectedOutput: 'false',
        callWrapper: 'console.log(isValid("(]"));'
      },
      {
        input: '"([)]"',
        expectedOutput: 'false',
        callWrapper: 'console.log(isValid("([)]"));'
      }
    ]
  }
];
