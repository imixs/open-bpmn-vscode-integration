/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
// reflect-metadata must be the first import! Do not change the empty line below!
import "reflect-metadata";

import * as vscode from "vscode";
import { activate as extensionActivate } from "./open-bpmn-extension";

export function activate(context: vscode.ExtensionContext): Promise<void> {
  console.log("Launching Open-BPMN GLSP Server...");
  return extensionActivate(context);
}
