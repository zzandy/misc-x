import * as React from "react";
import * as reactdom from "react-dom";

import { Hello } from './components/hello';

reactdom.render(<Hello compiler='typescript' framework='react' />, document.getElementById('content'));