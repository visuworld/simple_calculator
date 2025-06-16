    (function () {
      const display = document.getElementById('display');
      const buttons = document.querySelectorAll('.buttons button');
      let currentInput = '0';

      // Regex helpers
      const endsWithOperator = /[+\-*\/]$/;
      const operators = /[+\-*\/]/g;

      function updateDisplay() {
        display.textContent = currentInput;
      }

      function clear() {
        currentInput = '0';
        updateDisplay();
      }

      function backspace() {
        if (currentInput.length <= 1) {
          clear();
          return;
        }
        currentInput = currentInput.slice(0, -1);
        if (currentInput === '' || currentInput === '-') {
          clear();
          return;
        }
        updateDisplay();
      }

      // Determines if last input is operator
      function lastCharIsOperator() {
        return endsWithOperator.test(currentInput);
      }

      // Check if the current input number (last operand) contains a decimal point
      function lastNumberHasDecimal() {
        const splitNums = currentInput.split(operators);
        return splitNums[splitNums.length -1].includes('.');
      }

      function appendValue(value) {
        if (value === '.') {
          if (lastNumberHasDecimal()) {
            return; // Prevent multiple decimals in one number
          }
          if (lastCharIsOperator() || currentInput === '0') {
            currentInput += '0.';
            updateDisplay();
            return;
          }
          currentInput += '.';
          updateDisplay();
          return;
        }

        if (endsWithOperator.test(currentInput)) {
          // Prevent two operators in a row
          if (/[+\-*\/]/.test(value)) {
            currentInput = currentInput.slice(0, -1) + value;
            updateDisplay();
            return;
          }
        }

        if (currentInput === '0') {
          if (/[+\-*\/]/.test(value)) {
            currentInput += value;
          } else {
            currentInput = value;
          }
          updateDisplay();
          return;
        }

        currentInput += value;
        updateDisplay();
      }

      function safeEval(expr) {
        // Replace unsafe characters
        if (/[^0-9+\-*/.]/.test(expr)) {
          throw new Error('Invalid characters');
        }
        // Prevent trailing operators
        expr = expr.replace(endsWithOperator, '');
        return Function('"use strict";return (' + expr + ')')();
      }

      function calculate() {
        try {
          const result = safeEval(currentInput);
          currentInput = String(result);
          updateDisplay();
        } catch {
          currentInput = 'Error';
          updateDisplay();
          setTimeout(() => {
            clear();
          }, 1500);
        }
      }

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const value = btn.getAttribute('data-value');
          if (btn.id === 'btn-clear') {
            clear();
          } else if (btn.id === 'btn-backspace') {
            backspace();
          } else if (btn.id === 'btn-equal') {
            calculate();
          } else if (value !== null) {
            appendValue(value);
          }
          display.focus();
        });
      });

      // Keyboard support
      document.addEventListener('keydown', (e) => {
        if (
          (e.key >= '0' && e.key <= '9') ||
          e.key === '.' ||
          ['+', '-', '*', '/'].includes(e.key)
        ) {
          e.preventDefault();
          appendValue(e.key);
        } else if (e.key === 'Enter' || e.key === '=') {
          e.preventDefault();
          calculate();
        } else if (e.key === 'Backspace') {
          e.preventDefault();
          backspace();
        } else if (e.key.toLowerCase() === 'c') {
          e.preventDefault();
          clear();
        }
      });

      updateDisplay();
    })();
  