import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import * as XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

const DownloadReport = () => {
  const [dataFetched, setDataFetched] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let salesData = [];
      let purchaseData = [];

      // Fetch sales data
      const salesSnapshot = await firestore().collection('salesReports').get();
      salesSnapshot.forEach(doc => {
        salesData.push({ id: doc.id, ...doc.data() });
      });

      // Fetch purchase data
      const purchaseSnapshot = await firestore().collection('datacolnew').get();
      purchaseSnapshot.forEach(doc => {
        purchaseData.push({ id: doc.id, ...doc.data() });
      });

      // Combine the data (for example, you could merge by date)
      const combinedData = salesData.map(sale => {
        const purchase = purchaseData.find(pur => pur.date === sale.date);
        return {
          Date: sale.date,
          Sales: sale.amount || 0,
          Purchases: purchase ? purchase.amount : 0,
          Profit: (sale.amount || 0) - (purchase ? purchase.amount : 0),
        };
      });

      setData(combinedData);
      setDataFetched(true);
    };

    fetchData();
  }, []);

  const generateExcel = async () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Monthly Report');

    // Write the Excel file
    const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });

    // Convert the binary string to array buffer
    const buffer = new ArrayBuffer(wbout.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i !== wbout.length; ++i) view[i] = wbout.charCodeAt(i) & 0xFF;

    const path = `${RNFS.DocumentDirectoryPath}/monthly_report.xlsx`;

    // Write the file to the local filesystem
    await RNFS.writeFile(path, buffer, 'base64')
      .then(() => {
        const shareOptions = {
          title: 'Share file',
          url: `file://${path}`,
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        };

        // Share the file
        Share.open(shareOptions)
          .then(res => console.log(res))
          .catch(err => console.log(err));
      })
      .catch(err => console.log('Error writing file:', err));
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Generate Monthly Report</Text>

      {dataFetched && (
        <TouchableOpacity
          onPress={generateExcel}
          style={{ padding: 10, backgroundColor: 'blue', borderRadius: 5 }}>
          <Text style={{ color: 'white' }}>Download Excel Report</Text>
        </TouchableOpacity>
      )}

      {!dataFetched && <Text>Loading data...</Text>}
    </View>
  );
};

export default DownloadReport;
