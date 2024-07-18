"""
Module for handling the parallel coordinates graph on the server.
"""
import os

class ParallelCoordinates():
    """
    For the necessary computation of the parallel coordinates of the graph.
    Data members:
        -Data: the data to be visualized.
        -dimensions: The number of axis on the data.
        -axesRange: The range (maximum and minimum) of each axis. Each coordinate is interpolated
        between the maximum and minimum values among all the possible values of that axis.
        -labels: Name of the axes.
    """
    def __init__(self):
        self.data = []
        self.dimensions = 0
        self.axesRange = []
        self.labels = []

    def loadDataFromFile(self, filename, coord=None):
        """
        Loads the data from the file, the number of dimensions, computes the range of each axis, and load the labels.
            -filename: the name of the file.
            -coord: The coordinates of the plot to analyse, None if all are required. It is suppossed to be an array of integers
        """
        path = os.path.dirname(os.path.realpath(__file__))
        file = path + '/../data/' + filename + ".data"
        with open(file) as dataFile:
            for line in dataFile:
                row = line.split(",")
                nRow = []
                try:
                    for r in row:
                        nRow.append(float(r))
                except:
                    continue
                else:
                    self.data.append(nRow)

        self.dimensions = len(self.data[0])
        self.loadLabels(filename)
        self.computeRanges()

    def loadLabels(self, filename):
        """ Loads the labels from file """
        path = os.path.dirname(os.path.realpath(__file__))
        file = path + '/../data/' + filename + ".labels.txt"
        with open(file) as labelsFile:
            for line in labelsFile:
                row = line.split(",")
                self.labels = row
        

    def computeRanges(self):
        """
        Compute the ranges of each axis.
        """
        self.axesRange.clear()
        for i in range(len(self.data[0])):
            minV = maxV = self.data[0][i]
            for j in range(len(self.data)):
                if self.data[j][i] < minV:
                    minV = self.data[j][i]
                elif self.data[j][i] > maxV:
                    maxV = self.data[j][i]
            self.axesRange.append([minV, maxV])

    def getData(self):
        """ Get all the data of the plot """
        return self.data.copy()

    def getRanges(self):
        """ Get the ranges of the axes """
        return self.axesRange.copy()

    def getLabels(self):
        """ Get the labels of the axis """
        return self.labels.copy()

    def getNumberOfAxes(self):
        """ Get the number of dimensions on the db """
        return self.dimensions
